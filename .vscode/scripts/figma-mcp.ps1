$ErrorActionPreference = "Stop"
$credentialTarget = "Framelink-MCP-Figma"

Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Text;

public static class FigmaCredentialStore
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct Credential
    {
        public uint Flags;
        public uint Type;
        [MarshalAs(UnmanagedType.LPWStr)] public string TargetName;
        [MarshalAs(UnmanagedType.LPWStr)] public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public uint CredentialBlobSize;
        public IntPtr CredentialBlob;
        public uint Persist;
        public uint AttributeCount;
        public IntPtr Attributes;
        [MarshalAs(UnmanagedType.LPWStr)] public string TargetAlias;
        [MarshalAs(UnmanagedType.LPWStr)] public string UserName;
    }

    [DllImport("Advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredRead(string target, uint type, uint flags, out IntPtr credential);

    [DllImport("Advapi32.dll", EntryPoint = "CredFree")]
    private static extern void CredFree(IntPtr credential);

    public static string ReadPassword(string target)
    {
        IntPtr credentialPointer;
        if (!CredRead(target, 1, 0, out credentialPointer))
        {
            throw new Win32Exception(Marshal.GetLastWin32Error());
        }

        try
        {
            Credential credential = (Credential)Marshal.PtrToStructure(
                credentialPointer,
                typeof(Credential)
            );
            if (credential.CredentialBlob == IntPtr.Zero || credential.CredentialBlobSize == 0)
            {
                return String.Empty;
            }

            byte[] blob = new byte[credential.CredentialBlobSize];
            Marshal.Copy(credential.CredentialBlob, blob, 0, blob.Length);
            return Encoding.Unicode.GetString(blob).TrimEnd('\0');
        }
        finally
        {
            CredFree(credentialPointer);
        }
    }
}
'@

try {
    $apiKey = [FigmaCredentialStore]::ReadPassword($credentialTarget)
} catch [System.ComponentModel.Win32Exception] {
    if ($_.Exception.NativeErrorCode -eq 1168) {
        [Console]::Error.WriteLine(
            "Missing Windows Credential Manager entry '{0}'. Add it as a Generic Credential before starting this server.",
            $credentialTarget
        )
    } else {
        [Console]::Error.WriteLine(
            "Unable to read the Figma credential from Windows Credential Manager (Win32 error {0}).",
            $_.Exception.NativeErrorCode
        )
    }
    exit 1
}

if ([String]::IsNullOrWhiteSpace($apiKey)) {
    [Console]::Error.WriteLine("The Windows Credential Manager entry does not contain a password.")
    exit 1
}

$env:FIGMA_API_KEY = $apiKey
$apiKey = $null

$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\.."))
$imageDirectory = Join-Path $workspaceRoot "figma-assets"
New-Item -ItemType Directory -Path $imageDirectory -Force | Out-Null

try {
    $npx = Get-Command "npx.cmd" -ErrorAction Stop
} catch {
    [Console]::Error.WriteLine("npx.cmd was not found on PATH. Install Node.js or correct the VS Code process PATH.")
    exit 1
}

& $npx.Source --yes "figma-developer-mcp@0.13.2" --stdio --image-dir $imageDirectory
exit $LASTEXITCODE

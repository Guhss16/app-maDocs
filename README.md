# maDocs

O **maDocs** é um aplicativo móvel para guardar, organizar e consultar documentos PDF em um só lugar. O projeto busca tornar mais simples o gerenciamento de documentos do dia a dia, com uma experiência direta e recursos de acesso rápido.

## O que você pode fazer

- Importar PDFs do dispositivo e cadastrar informações como nome, categoria e número do documento.
- Organizar documentos em categorias — pessoais, família, comprovantes, veículos e outros — e em pastas personalizadas.
- Marcar documentos para acesso rápido e localizar itens pela busca.
- Abrir PDFs em aplicativos compatíveis ou compartilhá-los usando as opções do dispositivo.
- Consultar a quantidade de documentos e o espaço ocupado, além de apagar o acervo pelas configurações.

## Tecnologias

- **React Native** e **Expo** para o desenvolvimento do aplicativo.
- **TypeScript** para tipagem e organização do código.
- **Expo Router** para navegação baseada em rotas.
- **Expo SQLite** para persistência local dos dados e metadados dos documentos.
- **Expo Document Picker** e **Expo File System** para selecionar PDFs e armazená-los no espaço privado do aplicativo.
- **NativeWind** e **Tailwind CSS** para estilização.
- APIs do Expo para abrir e compartilhar PDFs com outros aplicativos.

## Como os dados são armazenados

Os metadados e os PDFs adicionados são mantidos localmente no dispositivo, no banco SQLite e no armazenamento privado do aplicativo. O projeto não implementa sincronização em nuvem; por isso, os documentos não são enviados automaticamente para um servidor. Considere manter uma cópia segura dos arquivos importantes.

## Uso de inteligência artificial

Ferramentas de IA generativa, incluindo **ChatGPT** e **Copilot**, foram usadas como apoio durante o desenvolvimento — por exemplo, para explorar soluções, auxiliar na implementação, investigar problemas e melhorar a documentação. As IAs são ferramentas de assistência ao desenvolvimento: não são um recurso integrado ao aplicativo e não analisam os documentos armazenados nele.

## Baixar o aplicativo

O aplicativo está disponível exclusivamente pelo build publicado no Expo:

[Baixar o maDocs](https://expo.dev/accounts/guhss16/projects/maDocs/builds/2bb33819-d06d-48c6-b8b5-3dfc810db445)

Abra o link para acessar o build e siga as instruções exibidas na página para baixar e instalar o aplicativo.

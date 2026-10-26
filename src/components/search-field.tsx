import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import Svg, { Path } from "react-native-svg";

export type SearchFieldProps = Pick<
  TextInputProps,
  "onChangeText" | "onSubmitEditing" | "placeholder" | "value"
>;

export function SearchField({
  onChangeText,
  onSubmitEditing,
  placeholder = "Procurar Documentos...",
  value,
}: SearchFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Pesquisar documentos"
        autoCapitalize="none"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#8C8C8C"
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={styles.searchIcon}
      >
        <Svg width={29} height={42} viewBox="0 0 29 42" fill="none">
          <Path
            d="M14.688 29.3077C12.981 30.5842 10.8539 31.1667 8.73466 30.938C6.61546 30.7093 4.66154 29.6864 3.26613 28.0752C1.87072 26.4639 1.1374 24.3839 1.21376 22.2538C1.29012 20.1237 2.17049 18.1015 3.67768 16.5943C5.18488 15.0871 7.20703 14.2068 9.33716 14.1304C11.4673 14.0541 13.5473 14.7874 15.1585 16.1828C16.7698 17.5782 17.7927 19.5321 18.0214 21.6513C18.25 23.7705 17.6675 25.8977 16.3911 27.6047L22.6203 33.8339C22.8396 34.061 22.961 34.3653 22.9583 34.6811C22.9556 34.9969 22.8289 35.2989 22.6056 35.5222C22.3823 35.7455 22.0802 35.8722 21.7644 35.875C21.4486 35.8777 21.1444 35.7563 20.9172 35.5369L14.688 29.3077ZM15.6612 22.5558C15.6612 24.153 15.0267 25.6847 13.8974 26.814C12.768 27.9434 11.2363 28.5779 9.63918 28.5779C8.04204 28.5779 6.51031 27.9434 5.38096 26.814C4.25161 25.6847 3.61715 24.153 3.61715 22.5558C3.61715 20.9587 4.25161 19.427 5.38096 18.2976C6.51031 17.1683 8.04204 16.5338 9.63918 16.5338C11.2363 16.5338 12.768 17.1683 13.8974 18.2976C15.0267 19.427 15.6612 20.9587 15.6612 22.5558Z"
            fill="#3E5DF9"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 380,
    height: 70,
    alignSelf: "center",
  },
  input: {
    position: "absolute",
    top: 6,
    right: 8,
    bottom: 14,
    left: 8,
    paddingLeft: 16,
    paddingRight: 60,
    borderRadius: 40,
    backgroundColor: "#D9D9D9",
    color: "#8C8C8C",
    fontSize: 16,
    letterSpacing: -0.64,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  searchIcon: {
    position: "absolute",
    top: 2,
    right: 14,
    width: 42,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

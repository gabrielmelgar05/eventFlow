import { TextInput } from 'react-native';

export default function Input(props) {
  return (
    <TextInput
      className="border border-gray-300 rounded-lg px-3 py-2 my-2"
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

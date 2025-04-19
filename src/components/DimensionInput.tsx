interface TextFieldProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  step?: string;
}

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  min = "1",
  step = "1"
}: TextFieldProps) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
      />
    </div>
  );
};

export default TextField;
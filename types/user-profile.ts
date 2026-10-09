export type ThemeMode = "dark" | "light";

export interface ToggleSwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  theme: ThemeMode;
}

export interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
  theme: ThemeMode;
}

export interface SegmentedOption<T = ThemeMode> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T = ThemeMode> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme: ThemeMode;
}

export type EditableProfile = {
  name: string;
  jobTitle: string;
  phone: string;
  timezone: string;
  bio: string;
  language: string;
  avatar: string;
};

export interface FieldLabelProps {
  htmlFor: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
}

export interface ReadOnlyDetailProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

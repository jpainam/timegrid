import type { GlassButtonProps } from "./button.types";
import { Button } from "./Button";

export function GlassButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  color = "primary",
  style,
}: GlassButtonProps) {
  return (
    <Button
      title={loading ? "Loading..." : title}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      variant="solid"
      color={color}
      size="lg"
      style={style}
    />
  );
}

import React from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  variant?: 'solid' | 'outline' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  action?: 'primary' | 'secondary' | 'positive' | 'negative' | 'default';
  isLoading?: boolean;
}

interface ButtonTextProps extends React.ComponentPropsWithoutRef<typeof Text> {}

interface ButtonIconProps extends React.ComponentPropsWithoutRef<typeof View> {
  children: React.ReactNode;
}

interface ButtonGroupProps extends React.ComponentPropsWithoutRef<typeof View> {
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  isAttached?: boolean;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

const getButtonStyles = (
  variant: 'solid' | 'outline' | 'link',
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  action: 'primary' | 'secondary' | 'positive' | 'negative' | 'default'
) => {
  const styles: any = {};

  // Base styles
  styles.base = {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 1,
  };

  // Disabled state
  styles.disabled = {
    opacity: 0.4,
  };

  // Size styles
  const sizeStyles: Record<string, any> = {
    xs: { paddingHorizontal: 14, height: 32 },
    sm: { paddingHorizontal: 16, height: 36 },
    md: { paddingHorizontal: 20, height: 40 },
    lg: { paddingHorizontal: 24, height: 44 },
    xl: { paddingHorizontal: 28, height: 48 },
  };

  // Variant styles
  const variantStyles: Record<string, any> = {
    solid: {},
    outline: { borderWidth: 1 },
    link: { paddingHorizontal: 0 },
  };

  // Action styles
  const actionStyles: any = {};

  switch (action) {
    case 'primary':
      if (variant === 'solid') {
        actionStyles.backgroundColor = '#C6FF00';
        actionStyles.color = '#0E0E0E';
      } else if (variant === 'outline') {
        actionStyles.borderColor = '#C6FF00';
        actionStyles.color = '#C6FF00';
      } else {
        actionStyles.color = '#C6FF00';
      }
      break;
    case 'secondary':
      if (variant === 'solid') {
        actionStyles.backgroundColor = '#E4E7EB';
        actionStyles.color = '#1A1C1E';
      } else if (variant === 'outline') {
        actionStyles.borderColor = '#E4E7EB';
        actionStyles.color = '#1A1C1E';
      } else {
        actionStyles.color = '#1A1C1E';
      }
      break;
    case 'positive':
      if (variant === 'solid') {
        actionStyles.backgroundColor = '#4C6400';
        actionStyles.color = '#FFFFFF';
      } else if (variant === 'outline') {
        actionStyles.borderColor = '#4C6400';
        actionStyles.color = '#4C6400';
      } else {
        actionStyles.color = '#4C6400';
      }
      break;
    case 'negative':
      if (variant === 'solid') {
        actionStyles.backgroundColor = '#DC2626';
        actionStyles.color = '#FFFFFF';
      } else if (variant === 'outline') {
        actionStyles.borderColor = '#DC2626';
        actionStyles.color = '#DC2626';
      } else {
        actionStyles.color = '#DC2626';
      }
      break;
    default:
      actionStyles.backgroundColor = 'transparent';
  }

  return {
    ...styles.base,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...actionStyles,
  };
};

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      action = 'primary',
      isLoading = false,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    const buttonStyles = getButtonStyles(variant, size, action);

    return (
      <Pressable
        ref={ref}
        {...props}
        style={[buttonStyles, disabled && { opacity: 0.4 }, style]}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator
            size={size === 'xs' || size === 'sm' ? 'small' : 'large'}
            color={variant === 'solid' ? '#0E0E0E' : '#C6FF00'}
          />
        ) : (
          props.children
        )}
      </Pressable>
    );
  }
);

const ButtonText = React.forwardRef<React.ElementRef<typeof Text>, ButtonTextProps>(
  ({ style, ...props }, ref) => {
    return <Text ref={ref} {...props} style={[styles.buttonText, style]} />;
  }
);

const ButtonIcon = React.forwardRef<React.ElementRef<typeof View>, ButtonIconProps>(
  ({ style, ...props }, ref) => {
    return <View ref={ref} {...props} style={[styles.buttonIcon, style]} />;
  }
);

const ButtonSpinner = ({ size = 'md' }: { size?: string }) => (
  <ActivityIndicator size={size === 'xs' || size === 'sm' ? 'small' : 'large'} color="#0E0E0E" />
);

const ButtonGroup = React.forwardRef<React.ElementRef<typeof View>, ButtonGroupProps>(
  ({ className, space = 'md', isAttached = false, flexDirection = 'column', ...props }, ref) => {
    const spaceStyles = {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
    };

    return (
      <View
        ref={ref}
        {...props}
        style={[
          {
            flexDirection,
            gap: isAttached ? 0 : spaceStyles[space],
          },
        ]}
      />
    );
  }
);

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonIcon: {},
});

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };

import { View, Text } from '@tarojs/components'
import './index.scss'

export interface ButtonProps {
  text: string
  type?: 'primary' | 'default' | 'danger'
  size?: 'large' | 'medium' | 'small'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = 'default',
  size = 'medium',
  block = false,
  disabled = false,
  loading = false,
  onClick
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <View
      className={`button button-${type} button-${size} ${block ? 'button-block' : ''} ${disabled ? 'button-disabled' : ''}`}
      onClick={handleClick}
    >
      {loading && <View className='button-loading'></View>}
      <Text className='button-text'>{text}</Text>
    </View>
  )
}

export default Button 
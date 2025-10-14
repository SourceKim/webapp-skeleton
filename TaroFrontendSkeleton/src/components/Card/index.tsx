import { View, Text, Image } from '@tarojs/components'
import './index.scss'

export interface CardProps {
  title: string
  image: string
  description?: string
  price?: number | string
  onClick?: () => void
  extra?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, image, description, price, onClick, extra }) => {
  return (
    <View className='card' onClick={onClick}>
      <Image className='card-image' src={image} mode='aspectFill' />
      <View className='card-content'>
        <Text className='card-title'>{title}</Text>
        {description && <Text className='card-description'>{description}</Text>}
        <View className='card-footer'>
          {price !== undefined && (
            <Text className='card-price'>¥{typeof price === 'number' ? price.toFixed(2) : price}</Text>
          )}
          {extra && <View className='card-extra'>{extra}</View>}
        </View>
      </View>
    </View>
  )
}

export default Card 
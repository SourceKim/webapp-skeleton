import { View, Text } from '@tarojs/components'
import { ReactNode } from 'react'
import './index.scss'

export interface PopupProps {
  visible: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

const Popup: React.FC<PopupProps> = ({ visible, title, onClose, children }) => {
  if (!visible) return null

  return (
    <View className='popup-overlay' onClick={onClose}>
      <View className='popup-content' onClick={e => e.stopPropagation()}>
        <View className='popup-header'>
          <Text className='popup-title'>{title || '提示'}</Text>
          <View className='popup-close' onClick={onClose}>×</View>
        </View>
        <View className='popup-body'>
          {children}
        </View>
      </View>
    </View>
  )
}

export default Popup 
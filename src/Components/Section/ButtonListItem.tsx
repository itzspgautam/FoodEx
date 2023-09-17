import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Colors from '../../Constants/Colors';
import Heading from '../UI/Heading';
import Fonts from '../../Constants/Fonts';
import Icon from 'react-native-vector-icons/Octicons';
import Paragraph from '../UI/Paragraph';
import GradientView from '../UI/GradientView';

interface ButtonItem {
  title?: string;
}

interface ButtonItemProps {
  item: ButtonItem;
  activeButton?: any;
  setActiveButton?: any;
  icon?: ReactNode;
  onPress?: any;
}

const ButtonListItem: React.FC<ButtonItemProps> = ({
  item,
  setActiveButton,
  activeButton,
  icon,
  onPress,
}) => (
  <GradientView
    colors={
      activeButton?.title === item.title
        ? [Colors.PRIMARY[1], Colors.PRIMARY[2]]
        : [Colors.LIGHT[2], Colors.LIGHT[2]]
    }
    style={{borderRadius: 32}}>
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => {
        setActiveButton(item);
        onPress && onPress(item);
      }}>
      {icon && icon}

      <Paragraph
        level={3}
        fontFamily={Fonts.MEDIUM}
        style={{
          color:
            activeButton?.title === item.title
              ? Colors.LIGHT[1]
              : Colors.LIGHT[3],
        }}>
        {item?.title}
      </Paragraph>
    </TouchableOpacity>
  </GradientView>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default ButtonListItem;

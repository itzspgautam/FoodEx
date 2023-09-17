import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../Constants/Colors';
import ShadowBox from '../UI/ShadowBox';
import Lottie from 'lottie-react-native';
import Images from '../../Constants/Images';
import Heading from '../UI/Heading';
import Paragraph from '../UI/Paragraph';
import Fonts from '../../Constants/Fonts';
import Button from '../UI/Button';

export interface AlertModalRef {
  openModal: (
    status: 'success' | 'error',
    title: string,
    description: string,
    buttonText: string,
    buttonFunction: () => void,
  ) => void;
}

const AlertModal: React.ForwardRefRenderFunction<AlertModalRef> = (_, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    status: '',
    title: '',
    description: '',
    buttonText: '',
  });
  const [buttonFunction, setButtonFunction] = useState<(() => void) | null>(
    null,
  );

  const openModal = (
    status: string,
    title: string,
    description: string,
    buttonText: string,
    buttonFunction: () => void,
  ) => {
    setModalContent({status, title, description, buttonText});
    setButtonFunction(() => buttonFunction);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  const handleButtonPress = () => {
    console.log('Closinsssss');
    closeModal();
    if (buttonFunction) {
      buttonFunction();
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      statusBarTranslucent={true}
      transparent
      onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <ShadowBox style={styles.modalContent}>
          <View style={{alignItems: 'center', gap: 6, padding: 10}}>
            <Lottie
              source={
                modalContent.status === 'success'
                  ? Images.GIF.CHECK_GREEN
                  : Images.GIF.ERROR_RED
              }
              autoPlay
              loop={false}
              style={{height: 100}}
            />
            <Heading
              level="h3"
              style={{
                color:
                  modalContent.status === 'success'
                    ? Colors.GREEN[2]
                    : Colors.RED[2],
              }}>
              {modalContent.title}
            </Heading>
            <Paragraph
              level={2}
              fontFamily={Fonts.MEDIUM}
              style={{color: Colors.LIGHT[3], textAlign: 'center'}}>
              {modalContent.description}
            </Paragraph>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleButtonPress}
            style={{
              backgroundColor:
                modalContent.status === 'success'
                  ? Colors.GREEN[2]
                  : Colors.RED[2],
              justifyContent: 'center',
              width: '100%',
              height: 40,
            }}>
            <Heading
              level="h4"
              style={{color: Colors.LIGHT[1], textAlign: 'center'}}>
              {modalContent.buttonText}
            </Heading>
          </TouchableOpacity>
        </ShadowBox>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 50,
  },
  modalContent: {
    backgroundColor: Colors.LIGHT[1],
    borderRadius: 10,
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'space-between',
    gap: 15,
  },
});

export default forwardRef(AlertModal);


// All imports at the top
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSizes, spacing } from '../styles/theme';
import useTranslation from '../i18n/useTranslation';

// Styles before component


const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 7,
    minWidth: 120,
    shadowColor: colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: fontSizes.sm,
    color: colors.textLight,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    zIndex: 100,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
  },
  optionActive: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    letterSpacing: 1,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

const LANGUAGES = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'vi', label: 'TIẾNG VIỆT' },
  // Add more languages here as needed
];

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0, width: 180 });
  const buttonRef = useRef<View>(null);
  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];
  const ITEM_HEIGHT = 44;
  const MAX_VISIBLE = 5;
  const dropdownHeight = Math.min(LANGUAGES.length, MAX_VISIBLE) * ITEM_HEIGHT;

  const openDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPos({ x, y: y + height + 4, width });
        setModalVisible(true);
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.languageSwitcher}>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        activeOpacity={0.85}
        onPress={openDropdown}
      >
        <Ionicons name="globe-outline" size={22} color={colors.textLight} style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>{currentLang.label}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textLight} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.dropdown,
              {
                position: 'absolute',
                top: dropdownPos.y,
                left: dropdownPos.x,
                width: dropdownPos.width,
                height: dropdownHeight,
              },
            ]}
          >
            <FlatList
              data={LANGUAGES}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.code === locale && styles.optionActive,
                  ]}
                  onPress={() => {
                    setLocale(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    item.code === locale && styles.optionTextActive,
                  ]}>{item.label}</Text>
                </TouchableOpacity>
              )}
              getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
              style={{ flexGrow: 0 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default LanguageSwitcher;



import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import Paragraph from '../UI/Paragraph';
import Icon from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import Fonts from '../../Constants/Fonts';
import Colors from '../../Constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../State/store';
import {
  searchRestaurantAndFood,
  setSearchQuery,
} from '../../State/Features/RestaurantSlice';
import {navigate} from '../../Utils/NavigationUtils';

const SearchBar = ({
  handleSpeechSearch,
  type,
}: {
  handleSpeechSearch: any;
  type: 'TEXT' | 'BUTTON';
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {search} = useSelector((state: RootState) => state.Restaurant);

  //Search
  const handleSearch = (query: String) => {
    dispatch(setSearchQuery(query));
    dispatch(searchRestaurantAndFood(query));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.searchContainer}
      onPress={() => type === 'BUTTON' && navigate('Search')}>
      {type === 'TEXT' ? (
        <TextInput
          placeholder="Search for dishes & restaurants"
          style={{flex: 1, height: '100%', fontFamily: Fonts.MEDIUM}}
          value={search?.query}
          onChangeText={e => handleSearch(e)}
        />
      ) : (
        <Paragraph level={2} style={{color: Colors.LIGHT[3]}}>
          Search for dishes & restaurants
        </Paragraph>
      )}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Icon name="search" size={18} color={Colors.LIGHT[3]} />
        <View
          style={{
            height: 20,
            width: 1,
            backgroundColor: Colors.LIGHT[3],
            opacity: 0.4,
          }}
        />

        <TouchableOpacity onPress={handleSpeechSearch}>
          <FeatherIcon name="mic" size={20} color={Colors.PRIMARY[1]} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    height: 45,
    backgroundColor: Colors.LIGHT[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 20,
  },
});

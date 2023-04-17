import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet} from 'react-native';

export default function BottomSheetModal({
  children,
  sheetRef,
  minSnapPoint = 0,
  maxSnapPoint = 0,
  index = 0,
  enableContentPanningGesture = false,
}) {
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[minSnapPoint, maxSnapPoint]}
      index={index}
      enableContentPanningGesture={enableContentPanningGesture}>
      {children}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({});

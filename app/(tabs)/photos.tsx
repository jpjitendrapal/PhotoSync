import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import ImageViewer from "react-native-image-zoom-viewer";

export default function Photos() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const prevMonth = useRef<string | null>(null);
  const addMonth = useRef(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");

      if (status === "granted") {
        loadPhotos();
      }
    })();
  }, []);

  const loadPhotos = async () => {
    if (loading) return;
    setLoading(true);

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 50, // Adjust the number of photos to fetch per page
      after: endCursor,
      sortBy: [MediaLibrary.SortBy.creationTime], // Sort by creation time
    });

    const newPhotos = [...photos, ...media.assets].sort(
      (a, b) => b.creationTime - a.creationTime
    );

    setPhotos(newPhotos);
    setEndCursor(media.endCursor);
    setLoading(false);
  };

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  if (hasPermission === null) {
    return <Text>Requesting permissions...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to media library</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos Test</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          addMonth.current = false;
          const monthName = new Date(item.creationTime).toLocaleString(
            "en-US",
            { month: "short" }
          );
          if (prevMonth.current != monthName) {
            prevMonth.current = monthName;
            addMonth.current = true;
          }
          return (
            <TouchableOpacity onPress={() => handlePhotoPress(index)}>
              <View>
                {addMonth.current && (
                  <Text style={{ fontSize: 40 }}>{prevMonth.current}</Text>
                )}
                <Image source={{ uri: item.uri }} style={styles.photo} />
              </View>
            </TouchableOpacity>
          );
        }}
        numColumns={3} // Adjust the number of columns as needed
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        onEndReached={loadPhotos} // Load more photos when reaching the end
        onEndReachedThreshold={0.5} // Adjust the threshold as needed
      />

      <Modal
        visible={selectedPhotoIndex !== null}
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {selectedPhotoIndex !== null && (
            <ImageViewer
              imageUrls={photos.map((photo) => ({ url: photo.uri }))}
              index={selectedPhotoIndex}
              enableSwipeDown={true}
              onSwipeDown={handleCloseModal}
              renderIndicator={() => null}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
    fontSize: 16,
  },
});

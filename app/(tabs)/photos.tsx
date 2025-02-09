import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
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

  const deviceWidth = Dimensions.get("window").width;
  const photoWidth = (deviceWidth - 60) / 4; // Adjust the margin and padding as needed

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

  const groupPhotosByMonth = (photos: MediaLibrary.Asset[]) => {
    const groupedPhotos: { title: string; data: MediaLibrary.Asset[] }[] = [];
    const photosByMonth: { [key: string]: MediaLibrary.Asset[] } = {};

    photos.forEach((photo) => {
      const date = new Date(photo.creationTime);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!photosByMonth[month]) {
        photosByMonth[month] = [];
      }
      photosByMonth[month].push(photo);
    });

    for (const month in photosByMonth) {
      groupedPhotos.push({ title: month, data: photosByMonth[month] });
    }

    return groupedPhotos;
  };

  const handlePhotoPress = (sectionIndex: number, photoIndex: number) => {
    const index =
      groupedPhotos
        .slice(0, sectionIndex)
        .reduce((acc, section) => acc + section.data.length, 0) + photoIndex;
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

  const groupedPhotos = groupPhotosByMonth(photos);

  const renderPhotoRow = ({ section, index }: any) => {
    const items = section.data.slice(index * 4, index * 4 + 4);
    const sectionIndex = groupedPhotos.findIndex(
      (s) => s.title === section.title
    );
    return (
      <View style={styles.photoRow}>
        {items.map((photo: object, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => handlePhotoPress(sectionIndex, index * 4 + i)}
          >
            <Image
              source={{ uri: photo.uri }}
              style={[styles.photo, { width: photoWidth }]}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos</Text>
      <SectionList
        sections={groupedPhotos}
        keyExtractor={(item) => item.id}
        renderItem={({ section, index }) => {
          if (index % 4 === 0) {
            return renderPhotoRow({ section, index: Math.floor(index / 4) });
          }
          return null;
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    padding: 8,
    width: "100%",
  },
  photoRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginBottom: 10,
  },
  photo: {
    height: 80,
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

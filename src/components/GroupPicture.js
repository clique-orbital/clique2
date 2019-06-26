import React from "react";
import { View, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import imageCacheHoc from "react-native-image-cache-hoc";
import defaultPicture from "../assets/default_profile.png";

class GroupPicture extends React.Component {
  cacheImage = (source, style) => {
    const CacheableImage = imageCacheHoc(FastImage, {
      defaultPlaceholder: {
        component: FastImage,
        props: {
          style: style,
          source: defaultPicture
        }
      }
      // validProtocols: ["http", "https"]
      // fileHostWhitelist: ["localhost", "firebasestorage"]
    });
    return <CacheableImage source={source} style={style} />;
  };

  render() {
    const { value, cached } = this.props;
    let src = this.props.source;
    const style = {
      height: Dimensions.get("window").width * value,
      width: Dimensions.get("window").width * value,
      borderRadius: (Dimensions.get("window").width * value) / 2
    };
    if (!this.props.source.uri) {
      src = {
        uri: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
      };
    }
    return (
      <View>
        {cached ? (
          this.cacheImage(src, style)
        ) : (
          <FastImage source={src} style={style} />
        )}
      </View>
    );
  }
}

export default GroupPicture;

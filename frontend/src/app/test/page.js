"use client";
import React from "react";
import AvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";

class MyEditor extends React.Component {
  state = {
    image: "http://example.com/initialimage.jpg",
  };

  handleDrop = (dropped) => {
    this.setState({ image: dropped[0] });
  };

  render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        noClick
        noKeyboard
        style={{ width: "250px", height: "250px" }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor image={this.state.image} />
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
    );
  }
}

export default MyEditor;

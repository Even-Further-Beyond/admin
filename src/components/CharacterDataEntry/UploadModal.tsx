import * as React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import styled from 'styled-components';

import ImageTools from '../../utils/ImageTools';

const ImagePreviewDiv = styled.div`
  margin-top: 15px;
`;

const UploadContentDiv = styled.div`
  margin-top: 15px;
`;

const dropZoneStyle = {
  marginTop: '15px',
  width: '100%',
  height: '150px',
  borderWidth: '2px',
  borderColor: '#666666',
  borderStyle: 'dashed',
  borderRadius: '5px',
};

interface Props {
  isOpen: boolean;
  closeUploadModal: () => void;
  uploadImage: (image: string) => void;
  prefix: number;
}

interface State {
  uploadedFile?: File;
  imagePreviewURL?: string;
  fullSizeImage?: Blob;
  thumbnailImage?: Blob;
  statusMessage: string;
}

class UploadModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      uploadedFile: null,
      imagePreviewURL: '',
      fullSizeImage: null,
      thumbnailImage: null,
      statusMessage: '',
    };
  }

  closeUploadModal = () => {
    window.URL.revokeObjectURL(this.state.imagePreviewURL);
    this.setState({
      uploadedFile: null,
      imagePreviewURL: '',
    });
    this.props.closeUploadModal();
  }

  onImageDrop = (files: File[]) => {
    const reader = new FileReader();
    const file = files[0];

    reader.onloadend = () => {
      this.setState({
        uploadedFile: file,
        imagePreviewURL: reader.result,
      });
    };

    ImageTools.resize(file, {
      width: 225,
      height: 350,
    }, (blob, resize) => {
      this.setState({fullSizeImage: blob});
    });

    ImageTools.resize(file, {
      width: 112,
      height: 175,
    }, (blob, resize) => {
      if (resize === true) {
        this.setState({thumbnailImage: blob});
      }
    });

    reader.readAsDataURL(file);
  }

  renderImages() {
    return (
      <ImagePreviewDiv>
        <img src={this.state.imagePreviewURL} />
      </ImagePreviewDiv>
    );
  }

  uploadImage = () => {
    if (this.state.fullSizeImage && this.state.thumbnailImage) {
      this.setState({ statusMessage: 'Uploading...'} );

      const data = new FormData();
      const uploadPath = 'images/character';

      let prefix = ('00000' + this.props.prefix).slice(-6);
      prefix = prefix.substr(0, 3) + '/' + prefix.substr(3, 6) + '/0.jpg';

      data.append(uploadPath + '/small/' + prefix, this.state.thumbnailImage);
      data.append(uploadPath + '/big/' + prefix, this.state.fullSizeImage);

      const token = localStorage.getItem('id_token');

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': token ? `Bearer ${token}` : null,
        },
      };

      if (this.state.uploadedFile) {
        axios
        .post('http://' + process.env.REACT_APP_API_URI + '/api/uploadImage', data, config)
        .then((response) => {
          this.props.uploadImage(this.state.imagePreviewURL);
          this.setState({statusMessage: 'Uploaded images to s3 bucket!'});
        })
        .catch((error) => {
          this.setState({statusMessage: 'Unable to upload image'});
        });
      }
    }
  }

  render() {
    const actions = [(
      <RaisedButton
        label='Upload Image'
        key='Upload Image'
        secondary={true}
        keyboardFocused={true}
        style={{marginRight: '15px'}}
        disabled={!this.state.uploadedFile ? true : false}
        onClick={this.uploadImage}
      />
      ), (
      <RaisedButton
        label='Close Modal'
        primary={true}
        onClick={this.closeUploadModal}
      />
    )];

    return (
      <Dialog
        title='Image uploader to S3'
        actions={actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.closeUploadModal}
      >
        <span>Image will be uploaded to path {this.props.prefix}/0.jpg</span>
        <UploadContentDiv>
          <Dropzone
            style={dropZoneStyle}
            multiple={false}
            accept='image/*'
            onDrop={this.onImageDrop}
          >
            <span>Drop an image or select an image to upload</span>
          </Dropzone>
          {this.renderImages()}
        </UploadContentDiv>
        <span>{this.state.statusMessage}</span>
      </Dialog>
    );
  }
}

export default UploadModal;

// src/components/ImageUpload.js
import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Image,
  Alert,
  Table,
  Card,
} from "react-bootstrap";
import axios from "axios";
import APIs from "../util/APIs";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [labelDetails, setLabelDetails] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    try {
      // Convert the base64 image data to a Blob
      const base64Data = image.split(",")[1];
      const blob = new Blob([atob(base64Data)], { type: "image/jpeg" });

      // Convert the Blob to a File
      const file = new File([blob], "uploaded-image.jpeg", {
        type: "image/jpeg",
      });

      // Create a FormData object and append the image File
      const formData = new FormData();
      formData.append("image", file);

      // Make a POST request to your API using Axios
      const response = await axios.post(
        // "https://ueaee89584.execute-api.us-east-1.amazonaws.com/prod/upload-image",
        APIs.API_Upload_Image,
        {
          imageData: base64Data,
          fileName: fileName, // Adjust the file name as needed
        }
      );

      // Handle the API response and update the upload status
      if (response.status === 200) {
        setUploadStatus({
          type: "success",
          message: "Image uploaded successfully",
        });
      } else {
        setUploadStatus({
          type: "danger",
          message: `Failed to upload image: ${response.data.error}`,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setUploadStatus({ type: "danger", message: "Error uploading image" });
    }
  };

  const handleFetch = async () => {
    try {
      // Make a POST request to the API for fetching details
      const response = await axios.post(
        //"https://qrii8ucem0.execute-api.us-east-1.amazonaws.com/prod/detect-labels",
        APIs.API_Fetch_details,
        { fileName: fileName }
      );

      const responseData = JSON.parse(response.data.body);
      const labels = responseData.Labels || [];

      // Update state with label details
      setLabelDetails(labels);

      // Handle the response as needed
      console.log("Details fetched successfully:", response.data);

      // You can update the UI or state accordingly based on the response
    } catch (error) {
      console.error("Error fetching details:", error.message);
    }
  };

  const handleNewUpload = async () => {
    window.location.reload();
  };

  return (
    <Container className="mt-4">
      <div className="vue-uploadbox-wrap br-8 position-relative bg-main-7 p-10 bg-lighten">
        <div className="d-flex br-8 fg-white h-75 w-100 bg-main-7 border-white border-dashed border-1 h-100">
          <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-150">
            <Form>
              <Form.Group controlId="formImage">
                <Form.Label className="h4">Upload Image : </Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
              <br></br>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={!image}
              >
                Upload
              </Button>
              <br></br>
              <br></br>
              <Button
                variant="primary"
                onClick={handleNewUpload}
                disabled={!image}
              >
                New Upload
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* Show spinner when loading */}
      {uploadStatus && (
        <Alert variant={uploadStatus.type} className="mt-2">
          {uploadStatus.message}
        </Alert>
      )}
      {image && (
        <div className="mt-4">
          <h2>Uploaded Image:</h2>
          <p className="h5">File Name: {fileName}</p>{" "}
          {/* Display the file name */}
          <Image
            src={image}
            alt="Uploaded"
            thumbnail
            fluid
            style={{ width: "300px", height: "200px" }} // Set specific dimensions here
          />
          <br></br>
          <Button variant="primary" onClick={handleFetch} className="mt-3">
            Fetch Details
          </Button>
        </div>
      )}
      {labelDetails.length > 0 && (
        <div className="mt-4">
          <Card>
            {/* <Card.Body> */}
            <Card.Body
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Card.Title className="text-center">Label Details</Card.Title>
              <Table striped bordered hover responsive>
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {labelDetails.map((label, index) => (
                    <tr key={index}>
                      <td>{label.Name}</td>
                      <td>{label.Confidence.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default ImageUpload;

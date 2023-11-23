"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Styles from "../styles/myDocument.css";

const MyDocument = () => (
  <Document>
    <Page size="A4" className="page">
      This will have all of the necessary info for accessing all of the
      resources in the user's "Plan".
    </Page>
  </Document>
);

export default MyDocument;

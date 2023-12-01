"use client";
import React from "react";
import { Context } from "../store/appContext";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

// StyleSheet
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
  },
  resourceSection: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1px solid #ddd",
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
});

function filterNonNullValues(schedule) {
  const result = {};
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  daysOfWeek.forEach((day) => {
    if (!schedule) return;
    const startKey = `${day}Start`;
    const endKey = `${day}End`;
    if (schedule[startKey] !== null && schedule[endKey] !== null) {
      result[startKey] = schedule[startKey];
      result[endKey] = schedule[endKey];
    } else {
      result[startKey] = "closed";
      result[endKey] = "closed";
    }
  });
  return result;
}

function formatTime(time) {
  if (time === "closed") {
    return "closed";
  }
  if (!time) {
    return "";
  }

  const [hour, minute] = time.split(":");
  let formattedTime = time;

  if (parseInt(hour) > 12) {
    formattedTime = `${parseInt(hour) - 12}:${minute} p.m.`;
  } else {
    formattedTime = `${hour}:${minute} a.m.`;
  }
  return formattedTime;
}

// Function to format entire schedule

const MyDocument = ({ selectedResources }) => {
  const formatSchedule = (schedule) => {
    if (!schedule) {
      return {};
    }
    const filteredSchedule = filterNonNullValues(schedule);
    const formattedSchedule = {};
    Object.keys(filteredSchedule).forEach((key) => {
      const day = key.replace(/End|Start/g, "");
      const start = filteredSchedule[`${day}Start`];
      const end = filteredSchedule[`${day}End`];
      const formattedStart = formatTime(start);
      const formattedEnd = formatTime(end);
      formattedSchedule[day] =
        start && end && formattedStart !== "closed"
          ? `${formattedStart} - ${formattedEnd}`
          : "Closed";
    });
    return formattedSchedule;
  };

  if (!selectedResources) {
    return (
      <Document>
        <Page size="A4">
          <Text>No resources available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {selectedResources.map((resource) => (
          <View key={resource.id} style={styles.resourceSection}>
            <Text style={styles.title}>{resource.name}</Text>
            {resource.images && resource.images.length > 0 && (
              <Image src={resource.images[0]} style={styles.image} />
            )}
            <Text>{resource.description}</Text>
            {resource.website && (
              <Link href={`https://${resource.website}`}>Visit Website</Link>
            )}
            <View>
              {resource.schedule &&
                Object.entries(formatSchedule(resource.schedule)).map(
                  ([day, schedule], index) => (
                    <Text key={index} style={styles.scheduleText}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}: {schedule}
                    </Text>
                  )
                )}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;

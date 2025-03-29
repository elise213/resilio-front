import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";
import styles from "../styles/approveComments.css";

const ApproveComments = () => {
  const { store, actions } = useContext(Context);
  const [unapprovedComments, setUnapprovedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnapprovedComments = async () => {
      setIsLoading(true);
      const comments = await actions.getUnapprovedComments();
      setUnapprovedComments(comments);
      setIsLoading(false);
    };

    fetchUnapprovedComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      const success = await actions.approveComment(commentId);
      if (success) {
        setUnapprovedComments(
          unapprovedComments.filter(
            (comment) => comment.comment_id !== commentId
          )
        );
      }
    } catch (error) {
      Swal.fire("Error", "Could not approve comment.", "error");
    }
  };

  return (
    <div className="unapproved-page">
      <p className="unapproved-heading">Unapproved Comments</p>

      {isLoading ? (
        <div className="loading-alert">Loading...</div>
      ) : unapprovedComments.length === 0 ? (
        <p>No unapproved comments found.</p>
      ) : (
        <ul className="unapproved-ul">
          {unapprovedComments.map((comment) => (
            <li key={comment.comment_id}>
              <p>
                {comment.user_name}: {comment.comment_cont}
              </p>
              <button onClick={() => handleApprove(comment.comment_id)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApproveComments;

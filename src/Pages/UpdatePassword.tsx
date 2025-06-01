import React, { useState } from "react";
import { Formik } from "formik";
import { Form, Input, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { FlatButton } from "../Shared/FlatButton";
import * as Yup from "yup";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../App";
import { useNavigate } from "react-router-dom";
import { UseAuthContext } from "../Context/UseAuthContext";

const { Title, Text } = Typography;

type FormikValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = UseAuthContext();

  const handleUpdatePassword = async (
    values: FormikValues,
    { resetForm }: any
  ) => {
    setLoading(true);
    setError(null);

    if (!user || !user.email) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        values.currentPassword
      );

      // Reauthenticate first
      await reauthenticateWithCredential(user, credential);

      // Then update password
      await updatePassword(user, values.newPassword);

      setSuccess(true);
      resetForm();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdatePassword}
    >
      {(formik) => (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
            height: "100vh",
          }}
        >
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <div style={{ position: "relative", textAlign: "right" }}>
              <CloseOutlined
                onClick={() => navigate("/admin")}
                style={{
                  fontSize: "24px",
                  padding: "10px",
                  border: "1px solid black",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
            </div>

            <Title level={3} style={{ marginBottom: 0 }}>
              Update Password
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Secure your account with a strong password
            </Text>
            <br />

            {error && <Text type="danger">{error}</Text>}
            {success && (
              <Text type="success">Password updated successfully!</Text>
            )}

            <Form layout="vertical" onFinish={formik.handleSubmit}>
              <Form.Item
                label="Current Password"
                validateStatus={
                  formik.errors.currentPassword && formik.touched.currentPassword
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
              >
                <Input.Password
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                validateStatus={
                  formik.errors.newPassword && formik.touched.newPassword
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.newPassword && formik.errors.newPassword
                }
              >
                <Input.Password
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                validateStatus={
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              >
                <Input.Password
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>

              <FlatButton
                title="Update Password"
                onClick={formik.handleSubmit}
                disabled={loading}
                className="successbutton"
              />
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}
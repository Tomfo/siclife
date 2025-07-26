"use client";
import { getMemberbyId } from "@/helpers/api-request";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Link from "next/link";
import { useUserStore } from "@/app/store/userStore";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import Image from "next/image";
import {
  Typography,
  Grid,
  Box,
  Divider,
  Paper,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
} from "@mui/material";

// --- Section Title Component ---
function SectionTitle({ children }) {
  return (
    <Typography
      variant="h6"
      sx={{
        color: "#00ACAC",
        fontWeight: "bold",
        mt: 3,
        mb: 1,
        borderBottom: "1px solid #e0e0e0",
        pb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

// --- Field Display Component ---
function FieldDisplay({ label, value }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 500, wordBreak: "break-word" }}
      >
        {value || <span style={{ color: "#aaa" }}>—</span>}
      </Typography>
    </Grid>
  );
}

// --- Array Field Display ---
function ArrayFieldDisplay({ label, items, renderItem }) {
  return (
    <>
      {items && items.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {items.map((item, idx) => (
            <Paper
              variant="outlined"
              key={idx}
              sx={{ p: 2, bgcolor: "#fafbfc" }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {label} {items.length > 1 ? idx + 1 : ""}
              </Typography>
              {renderItem(item, idx)}
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No {label?.toLowerCase()} dependants.
        </Typography>
      )}
    </>
  );
}

// --- Main View Component ---
export default function MemberViewPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const params = useParams();
  const { id } = useUserStore((state) => state.user);
  const componentRef = useRef();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getmembersbyId", id],
    queryFn: () => getMemberbyId(id),
    enabled: !!id, // only run if id is truthy
  });

  // Handle user Edit
  const handleEditClick = (recordId) => {
    const user = { id: recordId };
    setUser(user);
    router.push("/members/edit/record");
  };

  const handleGeneratePdf = async () => {
    const element = componentRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2, // improve quality
      useCORS: true,
      backgroundColor: null, // transparent background
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "px", [canvas.width, canvas.height]);

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`Member_Registration_${data?.nationalId || "record"}.pdf`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
        {/* <Button variant="contained" onClick={fetchUser}>
          Retry
        </Button> */}
      </Box>
    );
  }

  if (!data) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="info">Record not Found.</Alert>
      </Box>
    );
  }

  return (
    <>
      {/* Print and PDF buttons (will be hidden when printing) */}
      <Box
        className="no-print"
        sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}
      >
        <Tooltip title="Edit details">
          <Button
            onClick={() => handleEditClick(id)}
            color="success"
            variant="contained"
          >
            <EditIcon />
            Edit Details
          </Button>
        </Tooltip>
        <Tooltip title="Download PDF">
          <Button onClick={handleGeneratePdf} color="error" variant="contained">
            <PictureAsPdfIcon />
            Download Details
          </Button>
        </Tooltip>
      </Box>

      <Box
        ref={componentRef}
        sx={{
          m: 2,
          p: { xs: 1, sm: 3 },
          bgcolor: "background.paper",

          width: "800px",
          mx: "auto",
        }}
      >
        {/* Title */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <Image
            src="/moba.png"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-full"
            style={{ width: 36, height: 36 }}
            unoptimized
          />
          <h1 className=" text-[#091b1b] font-bold justify-center text-2xl">
            MOBA 86 SIC LIFE POLICY REGISTRATION INFORMATION
          </h1>
        </div>

        {/* Identification Details */}
        <SectionTitle>Identification Details</SectionTitle>
        <table style={{ width: "100%", marginBottom: "16px" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "8px" }}>
                <FieldDisplay label="National ID" value={data.nationalId} />
              </td>
              <td style={{ width: "50%", padding: "8px" }}>
                <FieldDisplay label="Type of ID" value={data.idType} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Personal Details */}
        <SectionTitle>Personal Details</SectionTitle>
        <table style={{ width: "100%", marginBottom: "16px" }}>
          <tbody>
            <tr>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="First Name" value={data.firstName} />
              </td>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="Middle Name" value={data.middleName} />
              </td>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="Last Name" value={data.lastName} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>
                <FieldDisplay
                  label="Birthday (yyyy-mm-dd)"
                  value={data.birthday.split("T")[0]}
                />
              </td>
              <td style={{ padding: "8px" }}>
                <FieldDisplay label="Gender" value={data.gender} />
              </td>
              <td style={{ padding: "8px" }}></td>
            </tr>
          </tbody>
        </table>

        {/* Contact Details */}
        <SectionTitle>Contact Details</SectionTitle>
        <table style={{ width: "100%", marginBottom: "16px" }}>
          <tbody>
            <tr>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="Email" value={data.email} />
              </td>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="Telephone" value={data.telephone} />
              </td>
              <td style={{ width: "33%", padding: "8px" }}>
                <FieldDisplay label="Address" value={data.residence} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Spouse Details */}
        <SectionTitle>Spouse Details</SectionTitle>
        <table style={{ width: "100%", marginBottom: "16px" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%", padding: "8px" }}>
                <FieldDisplay label="Full Name" value={data.spouseFullname} />
              </td>
              <td style={{ width: "50%", padding: "8px" }}>
                <FieldDisplay
                  label="Birthday (yyyy-mm-dd)"
                  value={data.spousebirthday.split("T")[0]}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Children Details */}
        <SectionTitle>Children Details</SectionTitle>
        <ArrayFieldDisplay
          items={data.children}
          renderItem={(child, idx) => (
            <table style={{ width: "100%", marginBottom: "8px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", padding: "8px" }}>
                    <FieldDisplay label="Full Name" value={child.fullName} />
                  </td>
                  <td style={{ width: "50%", padding: "8px" }}>
                    <FieldDisplay
                      label="Birthday (yyyy-mm-dd)"
                      value={child.birthday.split("T")[0]}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        />

        {/* Parent Details */}
        <SectionTitle>Parent Details</SectionTitle>
        <ArrayFieldDisplay
          items={data.parents}
          renderItem={(parent, idx) => (
            <table style={{ width: "100%", marginBottom: "8px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%", padding: "8px" }}>
                    <FieldDisplay label="Full Name" value={parent.fullName} />
                  </td>
                  <td style={{ width: "30%", padding: "8px" }}>
                    <FieldDisplay
                      label="Birthday (yyyy-mm-dd)"
                      value={parent.birthday.split("T")[0]}
                    />
                  </td>
                  <td style={{ width: "30%", padding: "8px" }}>
                    <FieldDisplay
                      label="Relation"
                      value={parent.relationship}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        />

        {/* Undertaking */}
        <SectionTitle>Undertaking</SectionTitle>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
            Ongoing illness/condition:{" "}
            <Chip
              label={data.underlying ? "Yes" : "No"}
              color={data.underlying ? "warning" : "default"}
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          {data.underlying && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Known Health Conditions:{" "}
              {data.condition || (
                <span style={{ color: "#aaa" }}>None specified</span>
              )}
            </Typography>
          )}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
            Declaration Accepted:{" "}
            <Chip
              label={data.declaration ? "Yes" : "No"}
              color={data.declaration ? "success" : "default"}
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>
      </Box>
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Collapse,
  Box,
} from "@mui/material";
import { useBill } from "../context/BillContext";
import { useDoctor } from "../context/DoctorContext";
import { usePatient } from "../context/PatientContext";
import BillDiscountForm from "../components/BillDiscountForm";

const BillList = () => {
  const { getAllBills, markAsPaid, deleteBill, bills, loading } = useBill();
  const { getAllDoctor } = useDoctor();
  const { getAllPatients } = usePatient();
  const { setSelectedBill, selectedBill } = useBill();

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchData = async () => {
    try {
      await getAllDoctor();
      await getAllPatients();
      await getAllBills();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkPaid = async (id) => {
    await markAsPaid(id);
    await getAllBills();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      await deleteBill(id);
      await getAllBills();
    }
  };

  const handleOpenDiscount = (bill) => {
    setSelectedBill(bill);
    setShowDiscountModal(true);
  };

  const handleCloseDiscount = () => {
    setSelectedBill(null);
    setShowDiscountModal(false);
    getAllBills();
  };

  if (loading) return <Typography>Loading bills...</Typography>;

  return (
    <Box sx={{ width: "95vw", mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        All Bills
      </Typography>

      <TableContainer component={Paper} sx={{ width: "70%", p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Total (₹)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bills?.map((bill, index) => {
              const patientName =
                bill.appointment?.patient?.name || "Unknown Patient";
              const doctorName =
                bill.appointment?.doctor?.name || "Unknown Doctor";
              const createdDate = bill.created_at
                ? new Date(bill.created_at).toLocaleString()
                : "N/A";

              return (
                <React.Fragment key={bill.id}>
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{patientName}</TableCell>
                    <TableCell>{doctorName}</TableCell>
                    <TableCell>{bill.total_amount}</TableCell>
                    <TableCell
                      sx={{
                        color: bill.paid ? "green" : "red",
                        fontWeight: 500,
                      }}
                    >
                      {bill.paid ? "Paid" : "Unpaid"}
                    </TableCell>
                    <TableCell>{createdDate}</TableCell>
                    <TableCell>
                      {!bill.paid && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleMarkPaid(bill.id)}
                        >
                          Mark as Paid
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() =>
                          setExpandedRow(expandedRow === bill.id ? null : bill.id)
                        }
                      >
                        {expandedRow === bill.id ? "Hide" : "Details"}
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenDiscount(bill)}
                      >
                        Discount
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(bill.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Bill Items */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                      <Collapse in={expandedRow === bill.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                          {bill.items && bill.items.length > 0 ? (
                            <>
                              <Typography fontWeight={600} gutterBottom>
                                Bill Items
                              </Typography>

                              <Table size="small" sx={{ mb: 1 }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Qty</TableCell>
                                    <TableCell>Unit Price (₹)</TableCell>
                                    <TableCell>Total (₹)</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bill.items.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.service?.name}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>{item.unit_price}</TableCell>
                                      <TableCell>
                                        {(
                                          parseFloat(item.unit_price) *
                                          parseInt(item.quantity)
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>

                              <Typography variant="body2">
                                <strong>Tax:</strong> ₹{bill.tax} |{" "}
                                <strong>Discount:</strong> ₹{bill.discount}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No items found for this bill.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Discount Dialog */}
      <Dialog open={showDiscountModal} onClose={handleCloseDiscount} fullWidth maxWidth="sm">
        <DialogTitle>Apply Discount</DialogTitle>
        <DialogContent>
          <BillDiscountForm onClose={handleCloseDiscount} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BillList;

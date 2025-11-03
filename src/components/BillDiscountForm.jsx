import React, { useState } from "react";
import { useBill } from "../context/BillContext";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

const BillDiscountForm = ({ onClose }) => {
  const { selectedBill, billDiscount } = useBill();
  const [discount, setDiscount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (discount <= 0) {
      toast.error("Please enter a valid discount amount.");
      return;
    }

    try {
      await billDiscount(selectedBill.id, { discount });
      toast.success("Discount applied successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to apply discount.");
      console.error("❌ billDiscount error:", error);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Discount Amount (₹)</Form.Label>

          <Form.Control
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Form.Group>
        <div className="mt-3 text-end">
          <Button variant="secondary" onClick={onClose} className="me-2">
            Cancel
          </Button>
          <Button type="submit">Apply Discount</Button>
        </div>
      </Form>
    </div>
  );
};

export default BillDiscountForm;

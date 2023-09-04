import React, { useState } from "react";
import {
  // ... other imports
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  Avatar,
  TablePagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import moment from "moment";

const columns = [
  { id: "id", label: "No" },
  { id: "img", label: "Avatar" },
  { id: "title", label: "Title" },
  { id: "price", label: "Price" },
  { id: "status", label: "Status" },
  { id: "sellerName", label: "Seller" },
  { id: "buyerName", label: "Buyer" },
  { id: "isCompleted", label: "Is Completed" },
  { id: "payment_intent", label: "Payment Intent" },
  { id: "createdAt", label: "Created At" },
  { id: "date", label: "Date" },
  { id: "submission", label: "Work Submission by Seller" },
  { id: "submissionToBuyer", label: "Work Submission to Buyer" },
  { id: "action", label: "Action" }, // New column for the action button
];

const TableWithPagination = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [orderIdForApproval, setOrderIdForApproval] = useState(null);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["orderList"],
    queryFn: () =>
      newRequest.get(`/admin/orders`).then((res) => {
        return res.data.map((order) => ({
          ...order,
          id: order._id, // Use _id as id
          sellerName: order.sellerName || "N/A",
          buyerName: order.buyerName || "N/A",
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
        }));
      }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleApproved = (orderId) => {
    // Open the confirmation dialog
    setOrderIdForApproval(orderId);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmation = async () => {
    // Close the confirmation dialog
    setIsConfirmationDialogOpen(false);

    // Perform the approval action
    if (orderIdForApproval) {
      console.log(orderIdForApproval, "orderId");
      const response = await newRequest.put(
        `/admin/received/${orderIdForApproval}`
      );
      console.log(response.data, "received response");
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = filteredData
    .slice()
    .sort((a, b) => {
      if (orderBy === "") return 0;
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    })
    .sort((a, b) => {
      // Sort by updatedAt in descending order (latest order first)
      return b.updatedAt - a.updatedAt;
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="elg">
      <Box mt={3}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id}>
                    {/* {console.log(row, "row")} */}
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Avatar alt={row.username} src={row.img} />
                    </TableCell>
                    {columns.slice(2, columns.length - 1).map((column) => (
                      <TableCell key={column.id}>
                        {column.id === "createdAt" ||
                        column.id === "updatedAt" ? (
                          new Date(row[column.id]).toLocaleString()
                        ) : column.id === "isCompleted" ? (
                          row[column.id] ? (
                            "Yes"
                          ) : (
                            "No"
                          )
                        ) : column.id === "price" ? (
                          `$${row[column.id]}`
                        ) : column.id === "status" ? (
                          row[column.id] === "accepted" ? (
                            "Approved"
                          ) : (
                            row[column.id]
                          )
                        ) : column.id === "date" ? (
                          moment(row.updatedAt).fromNow() // Format date using moment
                        ) : column.id === "submission" ? (
                          <span
                            style={{
                              color:
                                row.submission === "Work completed"
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {row.submission}
                          </span>
                        ) : column.id === "submissionToBuyer" ? (
                          <span
                            style={{
                              color:
                                row.received === "Work received"
                                  ? "green"
                                  : "orange",
                            }}
                          >
                            {row.received === "Work received"
                              ? "Work Sent to Buyer"
                              : "Work Not Sent to Buyer"}
                          </span>
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}

                    <TableCell>
                      {row.submission === "Work completed" ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleApproved(row._id)}
                        >
                          Approved
                        </Button>
                      ) : (
                        "WL"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to approve this order?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsConfirmationDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmation} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TableWithPagination;

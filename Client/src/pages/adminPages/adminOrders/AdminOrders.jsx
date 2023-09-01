import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  Container,
  Box,
  Avatar,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";

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
  {},
];

const TableWithPagination = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["orderList"],
    queryFn: () =>
      newRequest.get(`/admin/orders`).then((res) => {
        console.log(res.data, "orderList");
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

  const handleToggleSeller = (userId, isSeller) => {
    console.log(userId, "userId");
    console.log(isSeller, "isSeller");
    // Implement logic to toggle isSeller status and update it on the server
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
    <Container maxWidth="lg">
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
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Avatar alt={row.username} src={row.img} />
                    </TableCell>
                    {columns.slice(2, columns.length - 1).map((column) => (
                      <TableCell key={column.id}>
                        {column.id === "createdAt" || column.id === "updatedAt"
                          ? new Date(row[column.id]).toLocaleString() // Format date as a string
                          : column.id === "isCompleted"
                          ? row[column.id]
                            ? "Yes"
                            : "No"
                          : column.id === "price"
                          ? `$${row[column.id]}` // Add the dollar sign here
                          : row[column.id]}
                      </TableCell>
                    ))}
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
    </Container>
  );
};

export default TableWithPagination;

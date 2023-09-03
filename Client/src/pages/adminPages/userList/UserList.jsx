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
  Button,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";

const columns = [
  { id: "id", label: "No" },
  { id: "avatar", label: "Avatar" },
  { id: "username", label: "Username" },
  { id: "email", label: "Email" },
  { id: "country", label: "Country" },
  { id: "phone", label: "Phone" },
  { id: "desc", label: "Description" },
  { id: "isSeller", label: "Is Seller" }, // New column for isSeller
  { id: "actions", label: "Actions" }, // New column for actions
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
    queryKey: ["userList"],
    queryFn: () =>
      newRequest.get(`/admin`).then((res) => {
        console.log(res.data, "userList");
        return res.data.map((user) => ({
          ...user,
          _id: user._id,
          createdAt: new Date(user.createdAt.$date),
          updatedAt: new Date(user.updatedAt.$date),
        }));
      }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleToggleSeller = async (userId, isSeller) => {
    console.log(userId, "userId");
    console.log(isSeller, "isSeller");

    try {
      const response = await newRequest.put(`/admin/toggleUserBlocked/${userId}`);
      console.log(response.data, "response.data");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data, "data");

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  console.log(filteredData, "filteredData");

  const sortedData = filteredData.slice().sort((a, b) => {
    if (orderBy === "") return 0;
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  console.log(sortedData, "sortedData");

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
                  <TableRow key={row._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Avatar alt={row.username} src={row.img} />
                    </TableCell>
                    {columns.slice(2, columns.length - 2).map((column) => (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    ))}
                    <TableCell>{row.isSeller ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleToggleSeller(row._id, row.isSeller)
                        }
                      >
                        {row.isBlocked ? "Unblock" : "Block"}
                      </Button>
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
    </Container>
  );
};

export default TableWithPagination;

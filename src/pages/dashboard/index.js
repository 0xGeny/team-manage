import { useEffect, useCallback, useState } from "react";
import axios from "axios";
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from "@mui/material/Button";
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { StyledEngineProvider } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, FormGroup, TextField, Menu } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { Select, InputLabel, MenuItem } from "@mui/material";
import SearchBar from "material-ui-search-bar";

function createData(id, name, role, group, ip_address, mac_address, created) {
    return {
        id,
        name,
        role,
        group,
        ip_address,
        mac_address,
        created,
    };
}
const rowsPerPage = 15;

const rows = [];
const groupdata = [];
const roledata = [];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        numeric: false,
        title: 'Id',
        key: 'id',
        disablePadding: true,
        label: 'Id',
    },
    {
        id: 'name',
        numeric: false,
        title: 'Name',
        key: 'name',
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'role',
        numeric: false,
        title: 'Role',
        key: 'role',
        disablePadding: false,
        label: 'Role',
    },
    {
        id: 'group',
        numeric: false,
        disablePadding: false,
        title: 'Group',
        key: 'group',
        label: 'Group',
    },
    {
        id: 'ip_address',
        numeric: false,
        disablePadding: false,
        title: 'IP Address',
        key: 'ip_address',
        label: 'IP Address',
    },
    {
        id: 'mac_address',
        numeric: false,
        disablePadding: false,
        title: 'MAC Address',
        key: 'mac_address',
        label: 'MAC Address',
    },
    {
        id: 'created',
        numeric: false,
        disablePadding: false,
        title: 'Created',
        key: 'created',
        label: 'Created',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    /> */}
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 }
            }}
        >
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
            </Typography>


            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function Dashboard() {
    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("token").split(" ")[0] === "Frog") {
                axios.post("http://192.168.40.33:7150/auth/", { token: localStorage.getItem("token") })
                    .then((res) => {
                        if (res.data.message === "invalid") {
                            window.location.href = "/login";
                        }
                        else if (res.data.message === "success_auth") {
                            let temp = JSON.parse(res.data.data);
                            for (let i = 0; i < temp.length; i++) {
                                rows.pop(createData(i + 1, temp[i].name, temp[i].role, temp[i].group, temp[i].ip_address, temp[i].mac_address, temp[i].created));
                            }
                            for (let i = 0; i < temp.length; i++) {
                                rows.push(createData(i + 1, temp[i].name, temp[i].role, temp[i].group, temp[i].ip_address, temp[i].mac_address, temp[i].created));
                            }
                            let temp1 = JSON.parse(res.data.group);
                            delete roledata[0];
                            for (let i = 0; i < groupdata.length; i++) {
                                delete groupdata[i];
                                delete roledata[i + 1];
                            }

                            roledata.push({ name: 'Admin' });
                            for (let i = 0; i < temp1.length; i++) {
                                groupdata.push({ name: temp1[i].name })
                                roledata.push({ name: 'Boss of ' + temp1[i].name });
                            }
                            handleRequestSort('asc');
                        }
                    })
                    .catch((error) => {
                        // window.location.href = "/login";
                        // error = new Error();
                    });
            }
        }
        else window.location.href = "/login";
    }, []);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleDelete = (index) => {
        axios.post("http://192.168.40.33:7150/delete/", { name: rows[index - 1].name })
            .then((res) => {
                if (res.data.message === "success_delete") {
                    window.location.reload(true);
                }
            })
            .catch((error) => {
            });
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );


    const [searched, setSearched] = useState("");
    const requestSearch = searchedVal => {
        const filteredRows = rows.filter(row => {
            return row.name.toLowerCase().includes(searchedVal.toLowerCase())
        })
        visibleRows = JSON.parse(JSON.stringify(filteredRows));
    }

    const cancelSearch = () => {
        setSearched("")
        requestSearch(searched)
    }
    const [tableData, setTableData] = useState(rows),
        [dataFields, setDataFields] = useState(headCells),
        [editDialogOn, setEditDialogOn] = useState(false),
        [recordIdToEdit, setRecordIdToEdit] = useState(),
        onEditDialogOpen = (id) => (setRecordIdToEdit(id), setEditDialogOn(true)),
        handleEdit = (data) => {
            setEditDialogOn(false)
            let fname = rows.at(data.id - 1).name;
            const editedItemIdx = rows.findIndex(({ id }) => id == data.id)
            rows.splice(editedItemIdx, 1, data);
            // window.location.reload();

            axios.post("http://192.168.40.33:7150/edit/", { fname: fname, name: data.name, role: data.role, group: data.group, created: data.created })
                .then((res) => {
                    if (res.data.message === "success_edit") {
                        window.location.reload(true);
                    }
                })
                .catch((error) => {
                });
        };
    const [createDialogOn, setCreateDialogOn] = useState(false),
        [recordIdToCreate, setRecordIdToCreate] = useState(),
        onCreateDialogOpen = (id) => (setRecordIdToCreate(id), setCreateDialogOn(true)),
        handleCreate = (data) => {
            setCreateDialogOn(false);
            axios.post("http://192.168.40.33:7150/create/", { name: data.name, role: data.role, group: data.group, ip_address: data.ip_address, mac_address: data.mac_address})
                .then((res) => {
                    if (res.data.message === "success_create") {
                        window.location.reload(true);
                    }
                })
                .catch((error) => {
                });
        };
    return (
        <>
            <React.StrictMode>
                <StyledEngineProvider injectFirst>
                    <Sidebar />
                    <EditDialog
                        isOpen={editDialogOn}
                        onDialogClose={() => setEditDialogOn(false)}
                        onSubmitEdit={handleEdit}
                        recordData={rows.find(({ id }) => id == recordIdToEdit) || {}}
                        fields={dataFields}
                    />
                    <CreateDialog
                        isOpen={createDialogOn}
                        onDialogClose={() => setCreateDialogOn(false)}
                        onSubmitCreate={handleCreate}
                        recordData={rows.find(({ id }) => 1 == recordIdToCreate) || {}}
                        fields={dataFields}
                    />
                    <div style={{ float: "right", width: '85%' }}>
                        <Box sx={{ width: '100%' }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <Toolbar
                                    sx={{
                                        pl: { sm: 2 },
                                        pr: { xs: 1, sm: 1 }
                                    }}
                                >
                                    <Tooltip title="Create" onClick={() => onCreateDialogOpen()}>
                                        <IconButton>
                                            Create
                                        </IconButton>
                                    </Tooltip>
                                    <Typography
                                        sx={{ flex: '1 1 100%' }}
                                        variant="h6"
                                        id="tableTitle"
                                        component="div"
                                    >
                                    </Typography>
                                    {/* <SearchBar
                                        value={searched}
                                        onChange={searchVal => requestSearch(searchVal)}
                                        onCancelSearch={() => cancelSearch()}
                                    /> */}
                                    


                                    <Tooltip title="Filter list">
                                        <IconButton>
                                            <FilterListIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Toolbar>
                                <TableContainer>
                                    <Table
                                        sx={{ minWidth: 750 }}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
                                        />
                                        <TableBody>
                                            {visibleRows.map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        key={row.id}
                                                        sx={{ cursor: 'pointer' }}
                                                        align='left'
                                                    >
                                                        <TableCell padding="checkbox">
                                                        </TableCell>
                                                        <TableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            width='8%'
                                                        >
                                                            {row.id}
                                                        </TableCell>
                                                        <TableCell width='12%'>
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell width='12%'>
                                                            {row.role}
                                                        </TableCell>
                                                        <TableCell width='12%'>
                                                            {row.group}
                                                        </TableCell>
                                                        <TableCell width='18%'>
                                                            {row.ip_address}
                                                        </TableCell>
                                                        <TableCell width='18%'>
                                                            {row.mac_address}
                                                        </TableCell>
                                                        <TableCell width='12%'>
                                                            {row.created}
                                                        </TableCell>
                                                        <Tooltip title="Edit" style={{ transform: 'translateY(25%)' }}>
                                                            <IconButton onClick={() => onEditDialogOpen(row.id)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" style={{ transform: 'translateY(25%)' }}>
                                                            <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableRow>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: (dense ? 33 : 53) * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={rows.length}
                                    rowsPerPageOptions={[]}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                />
                            </Paper>
                            <FormControlLabel
                                control={<Switch checked={dense} onChange={handleChangeDense} />}
                                label="Dense padding"
                            />
                        </Box>
                    </div>
                </StyledEngineProvider>
            </React.StrictMode >
        </>
    )
}


const EditDialog = ({ isOpen, onDialogClose, onSubmitEdit, recordData, fields }) => {
    const [data, setData] = useState(recordData),
        handleEdit = (key, value) => setData({ ...data, [key]: value })
    return (
        <Dialog open={isOpen} onClose={onDialogClose} >
            <DialogTitle>Edit record</DialogTitle>
            <DialogContent>
                <FormGroup>
                    <TextField
                        key={fields[1].key}
                        defaultValue={recordData[fields[1].key]}
                        label={fields[1].title}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => handleEdit(fields[1].key, value)}
                    />
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Role"
                        onChange={({ target: { value } }) => handleEdit(fields[2].key, value)}
                    >
                        {
                            roledata.map(({ name }) => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Group"
                        onChange={({ target: { value } }) => handleEdit(fields[3].key, value)}
                    >
                        {
                            groupdata.map(({ name }) => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Button onClick={() => onSubmitEdit({ ...recordData, ...data })}>Submit</Button>
                    <Button onClick={() => onDialogClose()}>Cancel</Button>
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
}

const CreateDialog = ({ isOpen, onDialogClose, onSubmitCreate, recordData, fields }) => {
    const [data, setData] = useState(rows[1]),
        handleCreate = (key, value) => setData({ ...data, [key]: value })
    return (
        <Dialog open={isOpen} onClose={onDialogClose} >
            <DialogTitle>Create record</DialogTitle>
            <DialogContent>
                <FormGroup>
                    <TextField
                        key={fields[1].key}
                        label={fields[1].title}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => handleCreate(fields[1].key, value)}
                    />
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Role"
                        onChange={({ target: { value } }) => handleCreate(fields[2].key, value)}
                    >
                        {
                            roledata.map(({ name }) => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                    {/* <TextField
                        key={fields[3].key}
                        label={fields[3].title}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => handleCreate(fields[3].key, value)}
                    /> */}
                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Group"
                        onChange={({ target: { value } }) => handleCreate(fields[3].key, value)}
                    >
                        {
                            groupdata.map(({ name }) => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                        }
                    </Select>
                    <TextField
                        key={fields[4].key}
                        label={fields[4].title}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => handleCreate(fields[4].key, value)}
                    />
                    <TextField
                        key={fields[5].key}
                        label={fields[5].title}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => handleCreate(fields[5].key, value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Button onClick={() => onSubmitCreate({ ...recordData, ...data })}>Submit</Button>
                    <Button onClick={() => onDialogClose()}>Cancel</Button>
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
}

export default Dashboard;
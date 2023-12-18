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
import { Dialog, DialogTitle, DialogContent, FormGroup, TextField } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import createSvgIcon from "@mui/material";

function createData(id, group) {
    return {
        id,
        group,
    };
}
const rowsPerPage = 15;

const rows = [];

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
        width: '20%',
        label: 'Id',
    },
    {
        id: 'group',
        numeric: false,
        disablePadding: false,
        title: 'Group',
        key: 'group',
        width: '80%',
        label: 'Group',
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

            {/* <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip> */}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function Group() {
    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (localStorage.getItem("token").split(" ")[0] === "Frog") {
                axios.post("http://192.168.40.33:7150/auth/", { token: localStorage.getItem("token") })
                    .then((res) => {
                        if (res.data.message === "invalid") {
                            window.location.href = "/login";
                        }
                        else if (res.data.message === "success_auth") {
                            let temp = JSON.parse(res.data.group);
                            for (let i = 0; i < temp.length; i++) {
                                rows.pop(createData(i + 1, temp[i].name));
                            }
                            for (let i = 0; i < temp.length; i++) {
                                rows.push(createData(i + 1, temp[i].name));
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
        axios.post("http://192.168.40.33:7150/group_delete/", { name: rows[index - 1].group })
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

    const handle_name = (value, id) => {
        document.getElementById(id).value = 'value';
        //rows.at(id-1).id = value;
    }
    const [tableData, setTableData] = useState(rows),
        [dataFields, setDataFields] = useState(headCells),
        [editDialogOn, setEditDialogOn] = useState(false),
        [recordIdToEdit, setRecordIdToEdit] = useState(),
        onEditDialogOpen = (id) => (setRecordIdToEdit(id), setEditDialogOn(true)),
        handleEdit = (data) => {
            setEditDialogOn(false)
            let fname = rows.at(data.id - 1).group;
            const editedItemIdx = rows.findIndex(({ id }) => id == data.id)
            rows.splice(editedItemIdx, 1, data);
            // window.location.reload();

            axios.post("http://192.168.40.33:7150/group_edit/", { fname: fname, name: data.group})
                .then((res) => {
                    if (res.data.message === "success_groupedit") {
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
            axios.post("http://192.168.40.33:7150/creategroup/", { name: data.group })
                .then((res) => {
                    if (res.data.message === "success_creategroup") {
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
                        recordData={rows.find(({ id }) => id == recordIdToCreate) || {}}
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
                                                            width='26%'
                                                        >
                                                            {row.id}
                                                        </TableCell>
                                                        <TableCell width='66%'>
                                                            {row.group}
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
                        label={fields[1].title}
                        defaultValue={recordData[fields[1].key]}
                        style={{ paddingTop: '10px', marginTop: '10px' }}
                        onChange={({ target: { value } }) => {handleEdit(fields[1].key, value);}}
                    />
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
                        onChange={({ target: { value } }) => {handleCreate(fields[1].key, value);}}
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

export default Group;
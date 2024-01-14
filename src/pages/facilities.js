import { useCallback, useMemo, useState, useEffect, useReducer } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { FacilitiesTable } from 'src/sections/facility/facilities-table';
import { FacilitiesSearch } from 'src/sections/facility/facilities-search';
// import { reducer, initialState, HANDLERS } from 'src/sections/facility/reducer';
import { applyPagination } from 'src/utils/apply-pagination';

const useFacilities = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [data, page, rowsPerPage]
  );
};

const useFacilityIds = (facilities) => {
  return useMemo(
    () => {
      return facilities.map((customer) => customer.id);
    },
    [facilities]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const data = state.data || [];
  const [data, setData] = useState([]);
  const facilities = useFacilities(data, page, rowsPerPage);
  const facilitiesIds = useFacilityIds(facilities);
  const facilitiesSelection = useSelection(facilitiesIds);

  console.log(data, page, rowsPerPage, facilities);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  useEffect(() => {
    fetch('http://localhost:5175/Facility')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // dispatch({
        //   type: HANDLERS.GET_DATA,
        //   payload: data,
        // })
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <Head>
        <title>
          시설 | ReservationSystem
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  시설
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <FacilitiesSearch />
            <FacilitiesTable
              count={data.length}
              items={facilities}
              onDeselectAll={facilitiesSelection.handleDeselectAll}
              onDeselectOne={facilitiesSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={facilitiesSelection.handleSelectAll}
              onSelectOne={facilitiesSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={facilitiesSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

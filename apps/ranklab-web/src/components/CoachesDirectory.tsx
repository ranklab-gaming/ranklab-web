import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  TablePagination,
  Typography,
} from "@mui/material"
import { Coach } from "@ranklab/api"
import NextLink from "next/link"
import { FunctionComponent, useState } from "react"
import { Pagination } from "../@types"
import api from "../api/client"

interface Props {
  coaches: Coach[]
  pagination: Pagination
}

export const CoachesDirectory: FunctionComponent<Props> = function ({
  coaches: initialCoaches,
  pagination: { count, perPage, page: initialPage },
}) {
  const [page, setPage] = useState(initialPage)
  const [coaches, setCoaches] = useState(initialCoaches)

  const onPageChange = async (page: number) => {
    const requestParams = { page: page + 1 }

    const result = await api.playerCoachesList(requestParams)

    setPage(result.page)
    setCoaches(result.records)
  }

  return (
    <Grid container spacing={2}>
      {coaches.map((coach) => (
        <Grid item xs={12} sm={6} md={4} key={coach.id}>
          <Card>
            <NextLink
              href={`/player/recordings/new?coach_id=${coach.id}`}
              passHref
              legacyBehavior
            >
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {coach.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coach.bio}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <TablePagination
          sx={{ display: "flex", justifyContent: "flex-end" }}
          rowsPerPage={perPage}
          rowsPerPageOptions={[]}
          count={count}
          page={page - 1}
          onPageChange={(_e, p) => onPageChange(p)}
        />
      </Grid>
    </Grid>
  )
}

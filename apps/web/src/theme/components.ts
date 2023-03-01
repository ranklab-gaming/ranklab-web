import { Theme } from "@mui/material/styles"
import { Accordion } from "./components/Accordion"
import { Alert } from "./components/Alert"
import { Autocomplete } from "./components/Autocomplete"
import { Avatar } from "./components/Avatar"
import { Backdrop } from "./components/Backdrop"
import { Badge } from "./components/Badge"
import { Breadcrumbs } from "./components/Breadcrumbs"
import { Button } from "./components/Button"
import { ButtonGroup } from "./components/ButtonGroup"
import { Card } from "./components/Card"
import { Checkbox } from "./components/Checkbox"
import { Chip } from "./components/Chip"
import { ControlLabel } from "./components/ControlLabel"
import { CssBaseline } from "./components/CssBaseline"
import { DataGrid } from "./components/DataGrid"
import { Dialog } from "./components/Dialog"
import { Drawer } from "./components/Drawer"
import { Fab } from "./components/Fab"
import { Input } from "./components/Input"
import { Link } from "./components/Link"
import { List } from "./components/List"
import { LoadingButton } from "./components/LoadingButton"
import { Menu } from "./components/Menu"
import { Pagination } from "./components/Pagination"
import { Paper } from "./components/Paper"
import { Popover } from "./components/Popover"
import { Progress } from "./components/Progress"
import { Radio } from "./components/Radio"
import { Rating } from "./components/Rating"
import { Select } from "./components/Select"
import { Skeleton } from "./components/Skeleton"
import { Slider } from "./components/Slider"
import { Stepper } from "./components/Stepper"
import { SvgIcon } from "./components/SvgIcon"
import { Switch } from "./components/Switch"
import { Table } from "./components/Table"
import { Tabs } from "./components/Tabs"
import { Timeline } from "./components/Timeline"
import { ToggleButton } from "./components/ToggleButton"
import { Tooltip } from "./components/Tooltip"
import { TreeView } from "./components/TreeView"
import { Typography } from "./components/Typography"

export function createComponentOverrides(theme: Theme) {
  return [
    Accordion,
    Alert,
    Autocomplete,
    Avatar,
    Backdrop,
    Badge,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    Chip,
    ControlLabel,
    CssBaseline,
    DataGrid,
    Dialog,
    Drawer,
    Fab,
    Input,
    Link,
    List,
    LoadingButton,
    Menu,
    Pagination,
    Paper,
    Popover,
    Progress,
    Radio,
    Rating,
    Select,
    Skeleton,
    Slider,
    Stepper,
    SvgIcon,
    Switch,
    Table,
    Tabs,
    Timeline,
    ToggleButton,
    Tooltip,
    TreeView,
    Typography,
  ].reduce((acc, fn) => {
    return {
      ...acc,
      ...fn(theme),
    }
  }, {})
}

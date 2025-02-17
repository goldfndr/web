import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    Icon,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
} from '@mui/material';
import { getGpxTime } from '../../../manager/track/TracksManager';
import React, { forwardRef, useEffect, useState } from 'react';
import { ReactComponent as AscendingIcon } from '../../../assets/icons/ic_action_sort_by_name_ascending.svg';
import { ReactComponent as TimeIcon } from '../../../assets/icons/ic_action_time.svg';
import { ReactComponent as DescendingIcon } from '../../../assets/icons/ic_action_sort_by_name_descending.svg';
import { ReactComponent as LongToShortIcon } from '../../../assets/icons/ic_action_sort_long_to_short.svg';
import { ReactComponent as ShortToLongIcon } from '../../../assets/icons/ic_action_sort_short_to_long.svg';
import { ReactComponent as NewDateIcon } from '../../../assets/icons/ic_action_sort_date_1.svg';
import { ReactComponent as OldDateIcon } from '../../../assets/icons/ic_action_sort_date_31.svg';
import styles from '../trackmenu.module.css';

const az = (a, b) => (a > b) - (a < b);

function byAlpha(files, reverse) {
    return [...files].sort((a, b) => {
        const A = a.name;
        const B = b.name;
        return reverse ? (B > A) - (B < A) : (A > B) - (A < B);
    });
}

function byTime(files, reverse) {
    return [...files].sort((a, b) => {
        const A = getGpxTime(a, reverse);
        const B = getGpxTime(b, reverse);
        if (A === B) {
            return az(a.name, b.name);
        }
        return reverse ? B - A : A - B;
    });
}

function byDistance(files, reverse) {
    return [...files].sort((a, b) => {
        const A = a.analysis?.totalDistance ?? a.details?.analysis?.totalDistance ?? 0;
        const B = b.analysis?.totalDistance ?? b.details?.analysis?.totalDistance ?? 0;
        if (A === B) {
            return az(a.name, b.name);
        }
        return reverse ? B - A : A - B;
    });
}

function byCreationTime(files, reverse) {
    return [...files].sort((a, b) => {
        const A = getGpxTime(a, reverse, true);
        const B = getGpxTime(b, reverse, true);
        if (A === B) {
            return az(a.name, b.name);
        }
        return reverse ? B - A : A - B;
    });
}

const allMethods = {
    time: {
        default: true,
        reverse: true,
        callback: byTime,
        icon: <TimeIcon />,
        name: 'Last modified',
    },
    az: {
        reverse: false,
        callback: byAlpha,
        icon: <AscendingIcon />,
        name: 'Name A - Z',
    },
    za: {
        reverse: true,
        callback: byAlpha,
        icon: <DescendingIcon />,
        name: 'Name Z - A',
    },
    longest: {
        reverse: true,
        callback: byDistance,
        icon: <LongToShortIcon />,
        name: 'Longest distance first',
    },
    shortest: {
        reverse: false,
        callback: byDistance,
        icon: <ShortToLongIcon />,
        name: 'Shortest distance first',
    },
    newDate: {
        reverse: true,
        callback: byCreationTime,
        icon: <NewDateIcon />,
        name: 'Newest date first',
    },
    oldDate: {
        reverse: false,
        callback: byCreationTime,
        icon: <OldDateIcon />,
        name: 'Oldest date first',
    },
};

const defaultMethod = () => {
    for (let l in allMethods) {
        if (allMethods[l].default) {
            return l;
        }
    }
    return Object.keys(allMethods)[0];
};

const SortActions = forwardRef(
    (
        {
            files,
            setSortFiles,
            groups,
            setSortGroups,
            setOpenSort,
            selectedSort,
            setSelectedSort,
            setSortIcon,
            setSortName,
        },
        ref
    ) => {
        const [currentMethod, setCurrentMethod] = useState(selectedSort ? selectedSort : defaultMethod);

        function sort(method) {
            setSortFiles(allMethods[method].callback(files, allMethods[method].reverse));
            if (method === 'az' || method === 'za') {
                setSortGroups(allMethods[method].callback(groups, allMethods[method].reverse));
            }
        }

        useEffect(() => {
            sort(currentMethod);
        }, [files, selectedSort]);

        const handleChange = (event) => {
            const method = event.target.value;
            sort(method);
            setOpenSort(false);
            setSelectedSort(method);
            setSortIcon(allMethods[method].icon);
            setSortName(allMethods[method].name);
            setCurrentMethod(method);
        };

        const Label = ({ item }) => {
            return (
                <ListItem className={styles.sortItem}>
                    <Icon className={styles.icon}>{item.icon}</Icon>
                    <ListItemText className={styles.sortText}>{item.name}</ListItemText>
                </ListItem>
            );
        };

        return (
            <Box ref={ref}>
                <Paper className={styles.actions}>
                    <FormControl>
                        <RadioGroup value={currentMethod} onChange={handleChange}>
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="time"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.time} />}
                            />
                            <Divider className={styles.dividerActions} />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="az"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.az} />}
                            />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="za"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.za} />}
                            />
                            <Divider className={styles.dividerActions} />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="longest"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.longest} />}
                            />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="shortest"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.shortest} />}
                            />
                            <Divider className={styles.dividerActions} />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="newDate"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.newDate} />}
                            />
                            <FormControlLabel
                                className={styles.controlLabel}
                                disableTypography={true}
                                labelPlacement="start"
                                value="oldDate"
                                control={<Radio className={styles.control} size="small" />}
                                label={<Label item={allMethods.oldDate} />}
                            />
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Box>
        );
    }
);

SortActions.displayName = 'SortActions';
export default SortActions;

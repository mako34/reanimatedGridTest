/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const MARGIN = 5;
const DISTANCE = 1000

const Row = (props) => {

    const [show, setShow] = useState(false);

    const calcPos = (pos) => {
        return pos * width / 6 - MARGIN;
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, props.delay || 10);

        return () => clearTimeout(timeout);
    }, [])

    return (
        <View style={styles.row}>
            {show && props.items?.map((item, index) =>
                <View
                    style={[styles.cellContainer, { left: calcPos(item.pos) }]}
                    key={index}
                >
                    <Cell
                        selected={item.selected}
                        name={item.name}
                        component={item.component}
                        delay={(props.items.length - index) * 100}
                    />
                </View>
            )}
        </View>
    )
}

const Cell = (props) => {

    const move = useSharedValue(DISTANCE);
    const expand = useSharedValue(props.selected ? 1.3 : 1);
    const [active, setActive] = useState(props.selected ? true : false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            move.value = withSpring(0);
        }, props.delay || 10);

        return () => clearTimeout(timeout);
    }, [])

    const onPress = () => {
        if (expand.value == 1) {
            expand.value = withSpring(1.3, {
                damping: 1.3,

            });
            setActive(true);
        } else {
            expand.value = withSpring(1, {
                damping: 1.3,
            });
            setActive(false);
        }
    }

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: move.value },
            { scale: expand.value }
        ]
    }))

    return (
        <Animated.View
            style={[styles.cell, animatedStyles]}
        >
            <TouchableOpacity
                onPress={onPress}
                style={styles.innerCell}
            >
                {props.component}
                <View style={[styles.cover, {
                    backgroundColor: active ? 'transparent' : 'rgba(0, 0, 0, 0.5)'
                }]}>
                    {!active && <Text style={styles.name}>{props.name}</Text>}
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}
const GridSelector = (props) => {

    const [grid, setGrid] = useState({})

    useEffect(() => {
        const grid = {}
        const Col = [0, 2, 4, 1, 3]
        props.items?.map((item, index) => {
            const row = Math.trunc((index + 1) / 5) * 2 + (((index + 1) % 5) >= 3 ? 1 : 0)
            const col = Col[((index + 1) % 5)]
            if (!grid[row.toString()]) {
                grid[row.toString()] = {}
            }
            grid[row.toString()][col.toString()] = item;
        })
        setGrid(grid)
    }, [])

    return (
        <View style={styles.container}>
            {Object.keys(grid).map((row, index) => (
                <Row
                    key={index}
                    items={
                        Object.keys(grid[row]).map(cell =>
                            ({
                                pos: Number(cell),
                                component: <Image source={grid[row][cell]?.source} style={styles.img} />,
                                name: grid[row][cell]?.name,
                                selected: grid[row][cell]?.selected,
                            })
                        )}
                    delay={100 * index}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    row: {
        height: width / 3,
        width: '100%',
    },
    cell: {
        width: width / 3 - MARGIN * 2,
        height: width / 3 - MARGIN * 2,
        borderRadius: width / 6 - MARGIN,
        backgroundColor: 'grey',
        overflow: 'hidden'
    },
    cellContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 10,
    },
    innerCell: {
        flex: 1,
    },
    cover: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        margin: 10
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
});

export default GridSelector;

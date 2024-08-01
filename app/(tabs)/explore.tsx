import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const FRUIT_SIZE = 50;
const BASKET_HEIGHT = 20;
const BASKET_WIDTH = 150;
const GAME_DURATION = 60;

const FRUITS = ['Apple', 'Orange', 'Lemon', 'Pineapple', 'Kiwi', 'Strawberry', 'Cherry', 'Watermelon', 'Pear'];

const FRUIT_IMAGES = {
  Apple: require('../../assets/images/Apple.png'),
  Orange: require('../../assets/images/Orange.png'),
  Lemon: require('../../assets/images/Lemon.png'),
  Pineapple: require('../../assets/images/Pineapple.png'),
  Kiwi: require('../../assets/images/Kiwi.png'),
  Strawberry: require('../../assets/images/Strawberry.png'),
  Cherry: require('../../assets/images/Cherry.png'),
  Watermelon: require('../../assets/images/Watermelon.png'),
  Pear: require('../../assets/images/Pear.png'),
};

const Fruit = ({ position, type }) => {
  return (
    <Image
      source={FRUIT_IMAGES[type]}
      style={[styles.fruit, { left: position.x, top: position.y }]}
    />
  );
};

const Basket = ({ position }) => {
  return <View style={[styles.basket, { left: position.x }]} />;
};

const MoveFruits = (entities, { time }) => {
  const fruits = Object.keys(entities).filter(key => key.startsWith('fruit'));
  
  fruits.forEach(fruitKey => {
    const fruit = entities[fruitKey];
    fruit.position.y += 5;

    if (fruit.position.y > HEIGHT) {
      delete entities[fruitKey];
      entities.missed += 1;
    }

    if (
      fruit.position.y + FRUIT_SIZE >= entities.basket.position.y &&
      fruit.position.y <= entities.basket.position.y + BASKET_HEIGHT &&
      fruit.position.x + FRUIT_SIZE >= entities.basket.position.x &&
      fruit.position.x <= entities.basket.position.x + BASKET_WIDTH
    ) {
      delete entities[fruitKey];
      entities.caught += 1;
    }
  });

  if (Math.random() < 0.02 && fruits.length < 5) {
    const newFruitKey = `fruit${Date.now()}`;
    entities[newFruitKey] = {
      position: { x: Math.random() * (WIDTH - FRUIT_SIZE), y: -FRUIT_SIZE },
      type: FRUITS[Math.floor(Math.random() * FRUITS.length)],
      renderer: Fruit
    };
  }

  return entities;
};

const MoveBasket = (entities, { touches }) => {
  touches.filter(t => t.type === 'move').forEach(t => {
    entities.basket.position.x += t.delta.pageX;
    if (entities.basket.position.x < 0) entities.basket.position.x = 0;
    if (entities.basket.position.x > WIDTH - BASKET_WIDTH) entities.basket.position.x = WIDTH - BASKET_WIDTH;
  });
  return entities;
};

export default function ExploreScreen() {
  const [gameEngine, setGameEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            endGame();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const startGame = () => {
    setRunning(true);
    setTimeLeft(GAME_DURATION);
    setCaught(0);
    setMissed(0);
    gameEngine.swap({
      basket: { position: { x: WIDTH / 2 - BASKET_WIDTH / 2, y: HEIGHT - 100 }, renderer: Basket },
      caught: 0,
      missed: 0
    });
  };

  const endGame = async () => {
    setRunning(false);
    const finalCaught = gameEngine.entities.caught;
    const finalMissed = gameEngine.entities.missed;
    
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const updatedUserData = {
          ...parsedUserData,
          fruitsCaught: parsedUserData.fruitsCaught + finalCaught,
          fruitsMissed: parsedUserData.fruitsMissed + finalMissed,
          bestScore: Math.max(parsedUserData.bestScore, finalCaught),
        };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => { setGameEngine(ref) }}
        style={styles.gameContainer}
        systems={[MoveFruits, MoveBasket]}
        entities={{
          basket: { position: { x: WIDTH / 2 - BASKET_WIDTH / 2, y: HEIGHT - 100 }, renderer: Basket },
          caught: 0,
          missed: 0
        }}
        running={running}
        onEvent={(e) => {
          if (e.type === 'game_over') {
            endGame();
          } else if (e.type === 'score') {
            setCaught(gameEngine.entities.caught);
            setMissed(gameEngine.entities.missed);
          }
        }}
      >
        <Text style={styles.debugText}>
          Caught: {caught}, Missed: {missed}, Time: {timeLeft}s
        </Text>
      </GameEngine>
      {!running && 
        <Text style={styles.gameOverText} onPress={startGame}>
          Tap to Start Game
        </Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AA9E6',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  basket: {
    position: 'absolute',
    width: BASKET_WIDTH,
    height: BASKET_HEIGHT,
    backgroundColor: 'white',
  },
  fruit: {
    position: 'absolute',
    width: FRUIT_SIZE,
    height: FRUIT_SIZE,
  },
  debugText: {
    position: 'absolute',
    top: 40,
    left: 10,
    color: 'white',
    fontSize: 16,
  },
  gameOverText: {
    position: 'absolute',
    top: HEIGHT / 2,
    left: WIDTH / 2 - 100,
    width: 200,
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
  },
});
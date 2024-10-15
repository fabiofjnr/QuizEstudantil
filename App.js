import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecSenha from './pages/RecSenha';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';
import Play from './pages/Play';
import QuizGeografia from './pages/QuizGeografia';
import QuizGeografia2 from './pages/QuizGeografia2';
import QuizGeografia3 from './pages/QuizGeografia3';
import QuizHistoria from './pages/QuizHistoria';
import QuizHistoria2 from './pages/QuizHistoria2';
import QuizHistoria3 from './pages/QuizHistoria3';
import QuizPortugues from './pages/QuizPortugues';
import QuizPortugues2 from './pages/QuizPortugues2';
import QuizPortugues3 from './pages/QuizPortugues3';
import QuizQuimica from './pages/QuizQuimica';
import QuizQuimica2 from './pages/QuizQuimica2';
import QuizQuimica3 from './pages/QuizQuimica3';
import QuizEdFisica from './pages/QuizEdFisica';
import QuizEdFisica2 from './pages/QuizEdFisica2';
import QuizEdFisica3 from './pages/QuizEdFisica3';
import QuizMatematica from './pages/QuizMatematica';
import QuizMatematica2 from './pages/QuizMatematica2';
import QuizMatematica3 from './pages/QuizMatematica3';
import QuizFisica from './pages/QuizFisica';
import QuizFisica2 from './pages/QuizFisica2';
import QuizFisica3 from './pages/QuizFisica3';
import QuizSociologia from './pages/QuizSociologia';
import QuizSociologia2 from './pages/QuizSociologia2';
import QuizSociologia3 from './pages/QuizSociologia3';
import QuizBiologia from './pages/QuizBiologia';
import QuizBiologia2 from './pages/QuizBiologia2';
import QuizBiologia3 from './pages/QuizBiologia3';
import QuizIngles from './pages/QuizIngles';
import QuizIngles2 from './pages/QuizIngles2';
import QuizIngles3 from './pages/QuizIngles3';
import QuizArtes from './pages/QuizArtes';
import QuizArtes2 from './pages/QuizArtes2';
import QuizArtes3 from './pages/QuizArtes3';
import QuizFilosofia from './pages/QuizFilosofia';
import QuizFilosofia2 from './pages/QuizFilosofia2';
import QuizFilosofia3 from './pages/QuizFilosofia3';
import QuizEspanhol from './pages/QuizEspanhol';
import QuizEspanhol2 from './pages/QuizEspanhol2';
import QuizEspanhol3 from './pages/QuizEspanhol3';
import Materias from './pages/Materias';
import Salvos from './pages/Salvos';
import Anos from './pages/Anos';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from './firebase';
import AlertaBV from './pages/Alertas/AlertaBV';
import AlertaLogout from './pages/Alertas/AlertaLogout';

const Stack = createNativeStackNavigator();

const OtherScreensStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Play" component={Play} />
    <Stack.Screen name="Anos" component={Anos} />
    <Stack.Screen name="Materias" component={Materias} />
    <Stack.Screen name="QuizGeografia" component={QuizGeografia} />
    <Stack.Screen name="QuizGeografia2" component={QuizGeografia2} />
    <Stack.Screen name="QuizGeografia3" component={QuizGeografia3} />
    <Stack.Screen name="QuizHistoria" component={QuizHistoria} />
    <Stack.Screen name="QuizHistoria2" component={QuizHistoria2} />
    <Stack.Screen name="QuizHistoria3" component={QuizHistoria3} />
    <Stack.Screen name="QuizPortugues" component={QuizPortugues} />
    <Stack.Screen name="QuizPortugues2" component={QuizPortugues2} />
    <Stack.Screen name="QuizPortugues3" component={QuizPortugues3} />
    <Stack.Screen name="QuizQuimica" component={QuizQuimica} />
    <Stack.Screen name="QuizQuimica2" component={QuizQuimica2} />
    <Stack.Screen name="QuizQuimica3" component={QuizQuimica3} />
    <Stack.Screen name="QuizEdFisica" component={QuizEdFisica} />
    <Stack.Screen name="QuizEdFisica2" component={QuizEdFisica2} />
    <Stack.Screen name="QuizEdFisica3" component={QuizEdFisica3} />
    <Stack.Screen name="QuizMatematica" component={QuizMatematica} />
    <Stack.Screen name="QuizMatematica2" component={QuizMatematica2} />
    <Stack.Screen name="QuizMatematica3" component={QuizMatematica3} />
    <Stack.Screen name="QuizFisica" component={QuizFisica} />
    <Stack.Screen name="QuizFisica2" component={QuizFisica2} />
    <Stack.Screen name="QuizFisica3" component={QuizFisica3} />
    <Stack.Screen name="QuizSociologia" component={QuizSociologia} />
    <Stack.Screen name="QuizSociologia2" component={QuizSociologia2} />
    <Stack.Screen name="QuizSociologia3" component={QuizSociologia3} />
    <Stack.Screen name="QuizBiologia" component={QuizBiologia} />
    <Stack.Screen name="QuizBiologia2" component={QuizBiologia2} />
    <Stack.Screen name="QuizBiologia3" component={QuizBiologia3} />
    <Stack.Screen name="QuizIngles" component={QuizIngles} />
    <Stack.Screen name="QuizIngles2" component={QuizIngles2} />
    <Stack.Screen name="QuizIngles3" component={QuizIngles3} />
    <Stack.Screen name="QuizArtes" component={QuizArtes} />
    <Stack.Screen name="QuizArtes2" component={QuizArtes2} />
    <Stack.Screen name="QuizArtes3" component={QuizArtes3} />
    <Stack.Screen name="QuizFilosofia" component={QuizFilosofia} />
    <Stack.Screen name="QuizFilosofia2" component={QuizFilosofia2} />
    <Stack.Screen name="QuizFilosofia3" component={QuizFilosofia3} />
    <Stack.Screen name="QuizEspanhol" component={QuizEspanhol} />
    <Stack.Screen name="QuizEspanhol2" component={QuizEspanhol2} />
    <Stack.Screen name="QuizEspanhol3" component={QuizEspanhol3} />
    <Stack.Screen name="Salvos" component={Salvos} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

const AppTabs = ({ setIsLoggedIn }) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isInPlayScreen, setIsInPlayScreen] = useState(false); 
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);

  const handlePlayPress = () => {
    if (isInPlayScreen) {
      navigation.navigate('Anos');
    } else {
      navigation.navigate('Play');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Erro ao deslogar: ', error);
    }
  };

  useEffect(() => {
    const currentRoute = navigationState?.routes[navigationState.index]?.name;

    if (currentRoute === 'PlayTab') {
      setIsInPlayScreen(true);  
    } else {
      setIsInPlayScreen(false); 
    }
  }, [navigationState]);


  
  return (
    <>
      <Tab.Navigator
        initialRouteName="PlayTab"
        screenOptions={{
          tabBarActiveTintColor: '#B0C4DE',
          tabBarInactiveTintColor: 'white',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#1C98ED',
            height: 90,  
            paddingBottom: 10, 
            paddingTop: 10,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          headerStyle: {
            backgroundColor: '#1C98ED',
            borderBottomWidth: 0, 
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitle: 'Quiz Estudantil',
          headerTitleStyle: {
            fontFamily: 'BreeSerif',
            fontSize: 20,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          name="Ranking"
          component={Ranking}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="trophy" color={color} size={40} />
            ),
            headerTitle: 'Ranking',
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" color={color} size={40} />
            ),
            headerTitle: 'Perfil',
          }}
        />
 <Tab.Screen
        name="PlayTab"
        component={OtherScreensStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name="play-circle"
              color={color}
              size={90}
              style={{
                position: 'absolute',
                bottom: 15,
              }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            handlePlayPress(); 
          },
        }}
      />
        <Tab.Screen
          name="Salvos"
          component={Salvos}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bookmark" color={color} size={40} />
            ),
            headerTitle: 'Histórico de quizzes',
          }}
        />
        <Tab.Screen
          name="Logout"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="power-off" color={color} size={40} />
            ),
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setShowLogoutAlert(true);
            },
          }}
        />
      </Tab.Navigator>

      <AlertaLogout
        visible={showLogoutAlert}
        title="Deseja sair da sua conta?"
        message="Tem certeza que deseja deslogar?"
        onClose={() => setShowLogoutAlert(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Cadastro"
      component={Cadastro}
      options={{
        title: 'Cadastre-se!',
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        headerTitleAlign: 'center',
      }}
    />
    <Stack.Screen
      name="RecSenha"
      component={RecSenha}
      options={{
        title: 'Esqueceu a senha?',
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: 'black',
        headerTitleAlign: 'center',
      }}
    />
  </Stack.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  const [fontsLoaded] = useFonts({
    BreeSerif: require('./assets/BreeSerif-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        if (!alertShown) {
          setShowAlert(true);
          setAlertShown(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, [alertShown]);

  useEffect(() => {
    if (!isLoggedIn) {
      setAlertShown(false);
    }
  }, [isLoggedIn]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {isLoggedIn ? <AppTabs setIsLoggedIn={setIsLoggedIn} /> : <AuthStack />}
      </NavigationContainer>
      {showAlert && (
        <AlertaBV
          visible={showAlert}
          title="Quiz Estudantil"
          message="Seja bem-vindo(a) ao Quiz Estudantil!"
          onClose={() => setShowAlert(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C98ED', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
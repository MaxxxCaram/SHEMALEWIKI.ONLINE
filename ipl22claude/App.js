import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import DiagnosisScreen from './src/screens/DiagnosisScreen';
import ParametersScreen from './src/screens/ParametersScreen';

export default function App() {
  const [screen, setScreen] = useState('diagnosis');
  const [diagnosis, setDiagnosis] = useState(null);

  const handleSubmit = (data) => {
    setDiagnosis(data);
    setScreen('parameters');
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'diagnosis' ? (
        <DiagnosisScreen onSubmit={handleSubmit} />
      ) : (
        <ParametersScreen diagnosis={diagnosis} onBack={() => setScreen('diagnosis')} />
      )}
    </>
  );
}

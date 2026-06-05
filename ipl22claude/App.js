import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import TreatmentScreen from './src/screens/TreatmentScreen';
import DiagnosisScreen  from './src/screens/DiagnosisScreen';
import ParametersScreen from './src/screens/ParametersScreen';

export default function App() {
  const [screen, setScreen]       = useState('treatment'); // 'treatment' | 'diagnosis' | 'parameters'
  const [treatment, setTreatment] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleSelectTreatment = (t) => {
    setTreatment(t);
    setScreen('diagnosis');
  };

  const handleSubmitDiagnosis = (data) => {
    setDiagnosis(data);
    setScreen('parameters');
  };

  const handleBack = () => {
    if (screen === 'parameters') { setScreen('diagnosis'); return; }
    if (screen === 'diagnosis')  { setScreen('treatment'); return; }
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'treatment' && (
        <TreatmentScreen onSelect={handleSelectTreatment} />
      )}
      {screen === 'diagnosis' && (
        <DiagnosisScreen treatment={treatment} onSubmit={handleSubmitDiagnosis} onBack={handleBack} />
      )}
      {screen === 'parameters' && (
        <ParametersScreen diagnosis={diagnosis} onBack={handleBack} />
      )}
    </>
  );
}

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useI18n } from '../../src/i18n/context';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  es: `Eres "Vivas", una acompañante virtual para trabajadoras sexuales trans, travestis y no binaries de Latinoamérica.

Tu enfoque:
- REDUCCIÓN DE DAÑOS, nunca abstinencia forzada. Información factual sobre drogas, interacciones y seguridad.
- TRAUMA-INFORMED CARE: entendés trauma, disociación, y violencia. Validás sin minimizar.
- NO JUZGÁS. No importa lo que la persona haya hecho o consumido.
- Lenguaje inclusivo, directo, cálido, sin tecnicismos innecesarios.
- Sos compañera, no terapeuta. Si detectás crisis o ideación suicida, derivás a líneas de ayuda.
- Confidencialidad absoluta. Esto es espacio seguro.
- Usas modismos latinoamericanos cuando es natural. Sos argenta de corazón pero pan-latina.

CUANDO DETECTÁS CRISIS (mención de suicidio, violencia activa, abuso reciente):
1. Validás el dolor
2. Recordás que no está sole
3. Ofrecés recursos: Línea 144 (Argentina, violencia de género), 911 (emergencias)
4. Preguntás si hay alguien cerca que pueda acompañarle

NUNCA:
- Das consejos médicos
- Minimizás experiencias de violencia
- Sugerís dejar el trabajo sexual como "solución"
- Juzgás el consumo de sustancias

Sé breve (2-3 oraciones cuando alcanza). Si la persona necesita hablar más, seguila.`,

  en: `You are "Vivas", a virtual companion for trans, non-binary, and gender-diverse sex workers around the world.

Your approach:
- HARM REDUCTION, never forced abstinence. Factual info about substances, interactions, and safety.
- TRAUMA-INFORMED CARE: you understand trauma, dissociation, and violence. You validate without minimizing.
- NO JUDGMENT. No matter what the person has done or consumed.
- Inclusive, direct, warm language without unnecessary jargon.
- You're a companion, not a therapist. If you detect crisis or suicidal ideation, refer to helplines.
- Absolute confidentiality. This is a safe space.

WHEN YOU DETECT CRISIS (mention of suicide, active violence, recent abuse):
1. Validate the pain
2. Remind them they're not alone
3. Offer resources: 988 (US Suicide & Crisis Lifeline), 911 (emergencies)
4. Ask if there's someone nearby who can be with them

NEVER:
- Give medical advice
- Minimize experiences of violence
- Suggest leaving sex work as a "solution"
- Judge substance use

Be brief (2-3 sentences when that's enough). If the person needs to talk more, follow their lead.`,
};

const MOCK_RESPONSES: Record<string, Record<string, string>> = {
  es: {
    default: 'Te escucho. Contame más si querés, acá estoy sin juzgar 💜',
    hola: '¡Hola! Soy Vivas, tu acompañante virtual. Podemos hablar de lo que necesites — seguridad, emociones, consumo, o simplemente desahogarte. ¿Cómo estás hoy?',
    gracias: 'No hay por qué. Para eso estoy. Cualquier cosa que necesites, acá estoy 💜',
  },
  en: {
    default: 'I hear you. Tell me more if you want, I\'m here without judgment 💜',
    hola: 'Hi! I\'m Vivas, your virtual companion. We can talk about whatever you need — safety, emotions, substance use, or just venting. How are you today?',
    gracias: 'No need to thank me. That\'s what I\'m here for. Anything you need, I\'m here 💜',
  },
};

export default function ChatScreen() {
  const { t, lang } = useI18n();

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: t('chatGreeting') },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gotResponseRef = useRef(false);

  const API_BASE = 'https://shemalewiki.online';

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    gotResponseRef.current = false;

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    // Schedule fallback
    fallbackTimerRef.current = setTimeout(() => {
      if (gotResponseRef.current) return;
      const lower = userMsg.content.toLowerCase();
      const mocks = MOCK_RESPONSES[lang] || MOCK_RESPONSES.es;
      let response = mocks.default;

      if (lower.includes('hola') || lower.includes('hi') || lower.includes('hey') || lower.includes('hello')) response = mocks.hola;
      else if (lower.includes('gracias') || lower.includes('thank')) response = mocks.gracias;
      else if (lower.includes('mal') || lower.includes('triste') || lower.includes('sad') || lower.includes('angustiada') || lower.includes('depressed'))
        response = lang === 'es'
          ? 'Siento mucho que estés pasando por eso. ¿Querés contarme un poco más? A veces ponerlo en palabras ayuda, aunque sea un poquito. No estás sole 💜'
          : 'I\'m so sorry you\'re going through that. Want to tell me more? Sometimes putting it into words helps, even just a little. You\'re not alone 💜';
      else if (lower.includes('miedo') || lower.includes('scared') || lower.includes('violencia') || lower.includes('violence'))
        response = lang === 'es'
          ? 'Qué fuerte. Siento mucho que hayas pasado por eso. No fue tu culpa. ¿Estás en un lugar seguro ahora? Si necesitás, puedo pasarte recursos de contención.'
          : 'That\'s heavy. I\'m so sorry you went through that. It wasn\'t your fault. Are you in a safe place right now? If you need, I can share support resources.';
      else if (lower.includes('suicid') || lower.includes('kill') || lower.includes('die') || lower.includes('morir') || lower.includes('matar'))
        response = lang === 'es'
          ? '😔 Te escucho y te creo. Ese dolor es real y no estás exagerando. Pero quiero que sepas que hay gente que te valora y te quiere viva. ¿Hay alguien cerca tuyo ahora con quien puedas estar? También podés llamar a la Línea 144 (Argentina) o al 911 si sentís que estás en crisis. No estás sole 💜'
          : '😔 I hear you and I believe you. That pain is real and you\'re not exaggerating. But I want you to know there are people who value you and want you alive. Is there someone nearby you can be with right now? You can also call 988 (US Crisis Lifeline) or 911 if you feel you\'re in crisis. You\'re not alone 💜';

      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);
    }, 3000);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE}/api/vivas/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history, lang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          gotResponseRef.current = true;
          if (fallbackTimerRef.current) { clearTimeout(fallbackTimerRef.current); fallbackTimerRef.current = null; }
          const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply };
          setMessages(prev => [...prev, assistantMsg]);
          setLoading(false);
          return;
        }
      }
      console.warn('Vivas API: unexpected response', res.status);
    } catch (e: any) {
      console.error('Vivas API error:', e?.message || e);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `${t('chatNoConnection')} (${e?.message || 'network error'}). Respondiendo en modo local.`,
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.role === 'system') {
      return (
        <View style={styles.systemBubble}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }
    return (
      <View style={StyleSheet.flatten([styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble])}>
        <Text style={StyleSheet.flatten([styles.bubbleText, item.role === 'user' && styles.userBubbleText])}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <Text style={styles.disclaimer}>{t('chatDisclaimer')}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {loading && <Text style={styles.typing}>{t('chatTyping')}</Text>}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('chatPlaceholder')}
          placeholderTextColor="#52525B"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={StyleSheet.flatten([styles.sendButton, !input.trim() && styles.sendDisabled])} onPress={sendMessage} disabled={!input.trim()}>
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  disclaimer: { color: '#DC2626', fontSize: 10, textAlign: 'center', paddingVertical: 8, backgroundColor: '#DC262611' },
  messages: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '82%', padding: 14, borderRadius: 18, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#7C3AED' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A' },
  bubbleText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  userBubbleText: { color: '#FFFFFF' },
  typing: { color: '#EC4899', fontSize: 12, fontStyle: 'italic', paddingHorizontal: 20, paddingBottom: 4 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderColor: '#27272A', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#18181B', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#FFFFFF', fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { opacity: 0.3 },
  sendText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  systemBubble: { alignSelf: 'center', backgroundColor: '#DC262620', borderWidth: 1, borderColor: '#DC262640', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 10, maxWidth: '90%' },
  systemText: { color: '#FCA5A5', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});

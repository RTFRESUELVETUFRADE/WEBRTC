import { CIFRAS } from "./site";

/* ---------- Causales (home, bloque 2) ---------- */

export type Causal = {
  id: string;
  titulo: string;
  apoyo: string;
  /** Texto con que se prellena "Cuéntanos tu caso" al hacer clic en la tarjeta. */
  prellenado: string;
  icono: "Bank" | "HourglassMedium" | "Ruler" | "Scales" | "Briefcase" | "FirstAidKit";
};

export const CAUSALES: Causal[] = [
  {
    id: "credito",
    titulo: "Rechazo del crédito hipotecario",
    apoyo: "El banco dijo que no después de que firmaste.",
    prellenado: "El banco me rechazó el crédito hipotecario después de firmar la promesa. ",
    icono: "Bank",
  },
  {
    id: "atraso",
    titulo: "Atraso en la entrega",
    apoyo: "La fecha pasó y el proyecto sigue sin terminar.",
    prellenado: "La inmobiliaria no ha entregado en la fecha pactada. ",
    icono: "HourglassMedium",
  },
  {
    id: "condiciones",
    titulo: "Cambio de condiciones",
    apoyo: "Metrajes, terminaciones o financiamiento distintos a lo prometido.",
    prellenado: "El proyecto cambió respecto de lo que se me prometió (metraje, terminaciones o financiamiento). ",
    icono: "Ruler",
  },
  {
    id: "clausulas",
    titulo: "Cláusulas abusivas",
    apoyo: "Multas y sanciones que solo te afectan a ti.",
    prellenado: "Mi contrato tiene multas o cláusulas que me parecen abusivas. ",
    icono: "Scales",
  },
  {
    id: "cesantia",
    titulo: "Cesantía",
    apoyo: "Perdiste el trabajo y ya no puedes sostener el compromiso.",
    prellenado: "Perdí mi trabajo y ya no puedo continuar con la compra. ",
    icono: "Briefcase",
  },
  {
    id: "enfermedad",
    titulo: "Enfermedad",
    apoyo: "Un problema de salud cambió tu situación.",
    prellenado: "Un problema de salud cambió mi situación y no puedo continuar con la compra. ",
    icono: "FirstAidKit",
  },
];

/* ---------- Metodología ---------- */

export const PASOS = [
  {
    titulo: "Revisamos tu caso",
    corto: "Leemos tu promesa, identificamos la causal y te decimos qué vías tienes. Sin costo y sin compromiso.",
    largo:
      "Revisamos tu contrato de promesa y los antecedentes. Identificamos la causal que aplica, en qué plazos estás y qué vías tienes disponibles. Esta etapa es gratuita y sin compromiso: terminas sabiendo en qué posición estás, contrates o no.",
  },
  {
    titulo: "Negociamos con la inmobiliaria",
    corto: "Presentamos tu caso formalmente. La mayoría se resuelve aquí, en un acuerdo directo.",
    largo: `Presentamos tu caso formalmente ante la inmobiliaria. La mayoría de los casos se resuelve en esta etapa, porque una solicitud respaldada jurídicamente cambia por completo la disposición de la contraparte. Nuestra relación de trabajo con ${CIFRAS.inmobiliarias} inmobiliarias en Chile acelera este proceso.`,
  },
  {
    titulo: "Te representamos si hace falta",
    corto: "Si no hay acuerdo, tomamos tu representación: garantía, SERNAC o tribunales.",
    largo:
      "Si la negociación no prospera, asumimos tu representación por la vía que corresponda: cobro de la garantía, acción ante el SERNAC o demanda judicial. Esta etapa existe como respaldo, pero no es el punto de partida.",
  },
] as const;

/* ---------- Preguntas frecuentes ---------- */

export type Pregunta = { id: string; grupo: string; pregunta: string; respuesta: string[] };

export const GRUPOS_FAQ = ["¿Mi caso aplica?", "Cómo trabajamos", "Tiempos y costos"] as const;

export const PREGUNTAS: Pregunta[] = [
  {
    id: "califica",
    grupo: GRUPOS_FAQ[0],
    pregunta: "¿Cómo sé si mi caso califica para recuperar el pie?",
    respuesta: [
      "Revisamos primero dos condiciones. La primera es que tu contrato de promesa siga vigente, es decir, que todavía no se haya firmado la escritura definitiva de compraventa. La segunda es que exista una causa concreta por la cual la operación no pudo concretarse.",
      "Las más frecuentes son el rechazo del crédito hipotecario, el atraso en la entrega, un cambio en las condiciones del proyecto, cláusulas que te perjudican de forma desproporcionada, o un hecho personal sobreviniente como una cesantía o una enfermedad.",
      "Cada contrato es distinto y hay situaciones que no calzan exactamente con ninguna de estas categorías y que igualmente tienen salida. Para eso es la primera reunión gratuita: responder esta pregunta con tu contrato a la vista.",
    ],
  },
  {
    id: "firme-hace-tiempo",
    grupo: GRUPOS_FAQ[0],
    pregunta: "Firmé hace tiempo y ya pagué varias cuotas del pie. ¿Todavía puedo hacer algo?",
    respuesta: [
      "Sí, en muchos casos. Es una de las creencias más extendidas y también una de las que más oportunidades hace perder.",
      "Haber firmado y llevar pagos avanzados no te quita derechos. Lo que importa es si la operación llegó o no a concretarse, y por qué razón. Mientras la promesa siga vigente y no se haya firmado la escritura definitiva, sigues siendo un promitente comprador con derechos exigibles.",
      "Lo que sí conviene es no dejar pasar más tiempo. Las vías legales tienen plazos, y actuar a tiempo amplía las opciones disponibles.",
    ],
  },
  {
    id: "rechazo-credito",
    grupo: GRUPOS_FAQ[0],
    pregunta: "El banco me rechazó el crédito. ¿Eso significa que perdí el pie?",
    respuesta: [
      "No necesariamente, y es la consulta más común que recibimos.",
      "La normativa chilena de protección al consumidor y los pronunciamientos del SERNAC han reconocido que cuando una persona no puede concretar la compra por razones que no le son imputables (un cambio en las condiciones del mercado, la pérdida del empleo o el endurecimiento de las políticas del banco) tiene derecho a recuperar lo pagado sin que se le apliquen sanciones.",
      "La clave es esa idea de causa no imputable. Un rechazo que se origina en circunstancias ajenas a tu voluntad es una posición muy distinta a un desistimiento voluntario. Revisar el motivo exacto del rechazo es uno de los primeros pasos que damos.",
    ],
  },
  {
    id: "documentos",
    grupo: GRUPOS_FAQ[0],
    pregunta: "¿Qué documentos necesito para que revisen mi caso?",
    respuesta: [
      "Para la primera reunión basta con que nos cuentes tu situación. No necesitas llegar con una carpeta ordenada.",
      "Los documentos que aceleran el análisis son: el contrato de promesa firmado con sus anexos, los comprobantes de pago, la carta de rechazo del crédito si ese fue el caso, los correos relevantes con la inmobiliaria o el broker, y la póliza o documento de garantía si lo recibiste.",
      "Si te falta alguno, no es impedimento para conversar. Parte de nuestro trabajo es ayudarte a reunir lo que falta.",
    ],
  },
  {
    id: "proyecto-detenido",
    grupo: GRUPOS_FAQ[0],
    pregunta: "Compré en verde y el proyecto se detuvo. ¿Qué pasa con mi dinero?",
    respuesta: [
      "Esta situación tiene una protección específica que muchos compradores desconocen.",
      "La Ley General de Urbanismo y Construcciones, en su artículo 138 bis, obliga a las inmobiliarias a garantizar los dineros entregados por adelantado cuando venden inmuebles que aún no tienen recepción definitiva municipal. Esa garantía puede ser una póliza de seguro, una boleta bancaria u otros instrumentos que la ley contempla.",
      "Esa garantía permite reclamar sin depender de que la inmobiliaria tenga patrimonio disponible, algo especialmente importante cuando un proyecto se detiene o la empresa enfrenta problemas financieros. Verificar si fue constituida en tu caso es una de las primeras cosas que hacemos.",
    ],
  },
  {
    id: "proceso",
    grupo: GRUPOS_FAQ[1],
    pregunta: "¿Cómo funciona el proceso de principio a fin?",
    respuesta: [
      "Trabajamos en tres etapas. Primero revisamos tu caso: analizamos tu promesa y tus antecedentes, identificamos la causal, los plazos y las vías disponibles. Esta etapa es gratuita y termina con una explicación clara de tu situación, decidas o no continuar con nosotros.",
      "Después negociamos. Presentamos tu caso formalmente ante la inmobiliaria. La mayoría de los casos se resuelve en esta etapa.",
      "Si la negociación no prospera, asumimos tu representación: cobro de la garantía, acción ante el SERNAC o demanda judicial, según convenga a tu caso. Esta etapa existe como respaldo, no como punto de partida.",
    ],
  },
  {
    id: "demanda",
    grupo: GRUPOS_FAQ[1],
    pregunta: "¿Van a demandar a la inmobiliaria de inmediato?",
    respuesta: [
      "No. Ir a tribunales es el último recurso, no el primero.",
      "Un juicio es más lento, más costoso y más incierto que un acuerdo directo. Por eso la segunda etapa de nuestro trabajo es la negociación, y en la mayoría de los casos se llega a una solución sin litigar.",
      `Mantenemos relación de trabajo con ${CIFRAS.inmobiliarias} inmobiliarias en Chile, lo que facilita el diálogo. Si la negociación no da resultado, evaluamos contigo las vías legales que correspondan. Eso se conversa antes; nunca se decide por ti.`,
    ],
  },
  {
    id: "distancia",
    grupo: GRUPOS_FAQ[1],
    pregunta: "¿Tengo que ir a una oficina o puedo hacer todo a distancia?",
    respuesta: [
      "Puedes hacerlo todo a distancia. La primera reunión es por videollamada y puedes agendarla desde este sitio, en el horario que te acomode.",
      "Los documentos se envían en forma digital y el seguimiento se hace por el canal que prefieras. Atendemos casos en todo Chile, no solo en la Región Metropolitana. Si prefieres una reunión presencial, también la coordinamos.",
    ],
  },
  {
    id: "no-continuar",
    grupo: GRUPOS_FAQ[1],
    pregunta: "¿Qué pasa si después de la primera reunión decido no continuar?",
    respuesta: [
      "No pasa nada. La primera reunión es gratuita y sin compromiso, y eso significa exactamente lo que dice.",
      "Te vas con un diagnóstico claro de tu situación: qué dice tu contrato, qué causal podría aplicar, en qué plazos estás y qué opciones tienes. Esa información es tuya, la uses con nosotros o no.",
      "Sabemos que muchas personas postergan la consulta por miedo a quedar comprometidas. Por eso lo decimos con claridad: nadie firma nada en la primera reunión.",
    ],
  },
  {
    id: "quien",
    grupo: GRUPOS_FAQ[1],
    pregunta: "¿Quién lleva mi caso?",
    respuesta: [
      "Nuestro equipo jurídico, especializado en materia inmobiliaria y de protección al consumidor. No trabajamos con derivaciones ni con intermediarios comerciales.",
      "Cada formulario lo revisa una persona del equipo antes de contactarte. Cuando te llamemos, ya habremos mirado tu caso.",
    ],
  },
  {
    id: "demora",
    grupo: GRUPOS_FAQ[2],
    pregunta: "¿Cuánto demora recuperar el pie?",
    respuesta: [
      "Depende de la vía por la que se resuelva, y preferimos decirlo así antes que dar un número único.",
      "Un acuerdo directo con la inmobiliaria es considerablemente más breve que un proceso en tribunales; la diferencia puede ser de meses. Influyen la disposición de la inmobiliaria, la claridad de la causal, la situación financiera del proyecto y qué tan completos estén los antecedentes desde el inicio.",
      "En la primera reunión te damos una estimación realista para tu caso, con sus escenarios posibles.",
    ],
  },
  {
    id: "costo",
    grupo: GRUPOS_FAQ[2],
    pregunta: "¿Cuánto cuesta el servicio?",
    respuesta: [
      "La primera reunión es gratuita, siempre, y no genera ningún compromiso.",
      "Si decides avanzar, conversamos las condiciones antes de que firmes nada. Los honorarios dependen de la complejidad del caso y de la vía que corresponda, por lo que se definen caso a caso.",
      "Lo que sí garantizamos es que nunca vas a pagar por saber si tienes opciones.",
    ],
  },
  {
    id: "cuanto",
    grupo: GRUPOS_FAQ[2],
    pregunta: "¿Cuánto del pie se puede recuperar?",
    respuesta: [
      `Como referencia, en los casos que hemos resuelto la devolución se ha ubicado entre el ${CIFRAS.rangoDevolucion} del pie pagado, y en la mayoría ha sido total.`,
      "Ese dato describe casos anteriores y no garantiza el resultado del tuyo. El monto depende de lo que efectivamente pagaste y quedó establecido en el contrato, de la causal, de las cláusulas específicas de tu promesa y de la vía por la que se resuelva.",
      "En la primera reunión revisamos esos elementos y te damos una lectura fundada de lo que es razonable esperar en tu situación, incluidos los escenarios menos favorables.",
    ],
  },
  {
    id: "riesgo",
    grupo: GRUPOS_FAQ[2],
    pregunta: "¿Hay riesgo de que pierda más dinero al reclamar?",
    respuesta: [
      "Es una preocupación legítima. Cualquier acción legal tiene costos y escenarios posibles, incluida la posibilidad de que el resultado no sea el esperado.",
      "Por eso evaluamos esa relación antes de recomendarte cualquier camino. Si en nuestra opinión profesional el caso no tiene mérito suficiente, te lo decimos en la primera reunión. No tomamos casos solo por tomarlos.",
      "Y conviene mirar el otro lado: en varias situaciones el mayor riesgo está en no actuar, porque las vías legales tienen plazos y algunas se cierran con el tiempo.",
    ],
  },
  {
    id: "quiebra",
    grupo: GRUPOS_FAQ[2],
    pregunta: "¿Qué pasa si la inmobiliaria quebró o el proyecto fue abandonado?",
    respuesta: [
      "Sigue habiendo opciones, y en estos casos la garantía del artículo 138 bis cobra especial relevancia: en una compra en verde, la ley obligó a la inmobiliaria a respaldar los dineros anticipados justamente para escenarios en que la empresa no puede responder con su patrimonio.",
      "Además existen los procedimientos concursales, donde los acreedores pueden hacer valer sus créditos según el orden que establece la ley. Son casos más complejos y de plazos mayores, pero no están perdidos de antemano. Si estás en este escenario, actuar pronto importa todavía más.",
    ],
  },
];

/** Las cuatro que más desbloquean conversión, para el home. */
export const PREGUNTAS_HOME = ["no-continuar", "costo", "rechazo-credito", "demanda"].map(
  (id) => PREGUNTAS.find((p) => p.id === id)!
);

/* ---------- Testimonios (reels públicos en Instagram) ---------- */

export const TESTIMONIOS = [
  {
    nombre: "Carmen Haros",
    lugar: "Chiloé",
    caso: "Promesa de un departamento en Puerto Montt",
    cita: "Todo se pudo terminar de buena forma y no fue necesario vernos de manera presencial. Estuvieron conmigo en todo el proceso. Dan mucha paz, tranquilidad y, sobre todo, seguridad.",
    reel: "https://www.instagram.com/reel/CrMFXiFg2HX/",
  },
  {
    nombre: "Sandy Suárez",
    caso: "Devolución del pie",
    cita: "Estuvieron conmigo en cada momento. En menos de tres semanas ya había una solución con la inmobiliaria. Me guiaron y me explicaron todo.",
    reel: "https://www.instagram.com/reel/CqDQLWbgc4h/",
  },
  {
    nombre: "Francisco Clavijo",
    caso: "Atraso en la entrega y cambio de condiciones",
    cita: "El proyecto se atrasó y cambiaron las condiciones crediticias. Nos asesoraron en la negociación y finalmente ambas partes quedamos conformes. Mucha confianza, siempre dispuestos.",
    reel: "https://www.instagram.com/reel/CtPi3KPoDtO/",
  },
] as const;

/* ---------- Equipo ---------- */

export const SOCIOS = [
  {
    nombre: "Marcos Gundelach",
    cargo: "Gerente General y fundador",
    foto: "/img/marcos-gundelach.jpg",
    bio: "Fundó RTC después de años trabajando y asesorando en el sector inmobiliario. Dirige la relación con las inmobiliarias y la estrategia de negociación de cada caso.",
    linkedin: "https://www.linkedin.com/in/marcos-gundelach-lizarraga-a659b244/",
  },
  {
    nombre: "Belén Cabezas",
    cargo: "Fiscal",
    foto: "/img/belen-cabezas.jpg",
    bio: "Dirige el área jurídica del estudio. Evalúa la viabilidad de cada caso, define la vía legal que corresponde y supervisa su tramitación.",
    linkedin: "https://www.linkedin.com/in/bel%C3%A9n-cabezas-012b8b2b6/",
  },
] as const;

export const EQUIPO = [
  { nombre: "Rafaella Libretti", cargo: "Abogada" },
  { nombre: "Martín Atenas", cargo: "Ejecutivo legal" },
  { nombre: "Catalina Fellay", cargo: "Ejecutiva de atención" },
] as const;

/* 
   Alebrijes de Oaxaca Teotihuacán
   News Detail Page Script - Loads news content based on URL parameter
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get news slug from URL hash or query parameter
    const urlHash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(window.location.search);
    const newsSlug = urlHash || urlParams.get('noticia') || '';

    if (!newsSlug) {
        // No slug provided, redirect to news page
        window.location.href = 'noticias.html';
        return;
    }

    // News database - In a real application, this would come from a backend
    // For now, we'll define news content here
    const newsDatabase = {
        'victoria-contundente-ante-aguilas-de-teotihuacan': {
            title: 'Goleada 6-1 ante Aguilas',
            category: 'Liga TDP',
            categoryClass: 'liga-tdp',
            date: '2025-12-19T18:44:57',
            image: '../assets/victoria-contundente-ante-aguilas-de-teotihuacan/InicioPartido.jpg',
            content: `
                <p>Los Alebrijes de Oaxaca Teotihuacán cerraron la jornada con una victoria contundente ante Aguilas de Teotihuacán, dejando claro su dominio absoluto en el terreno de juego con un marcador final de 6-1 que refleja la calidad y el trabajo del equipo.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/FotoInicial.jpg" alt="Foto inicial del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El encuentro comenzó con un ritmo intenso desde el silbato inicial. Los Alebrijes mostraron su intención ofensiva desde los primeros minutos, presionando constantemente la defensa rival y creando múltiples oportunidades de gol que se tradujeron en una goleada histórica.</p>
                
                <h3>Primer tiempo demoledor</h3>
                
                <p>Desde el inicio, los Alebrijes tomaron el control del encuentro. A los 12 minutos, el equipo logró abrir el marcador tras una jugada colectiva perfectamente ejecutada que terminó en las redes. El primer gol dio confianza al equipo, que continuó atacando con determinación y eficacia.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada1.jpg" alt="Primera jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El segundo gol llegó antes del minuto 25, demostrando la superioridad ofensiva del equipo. Los Alebrijes mantuvieron la presión constante, creando múltiples oportunidades que finalmente se materializaron en el tercer gol antes del descanso, dejando un marcador parcial de 3-0 que reflejaba la diferencia entre ambos equipos.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada2.jpg" alt="Segunda jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada3.jpg" alt="Tercera jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <h3>Segundo tiempo sin tregua</h3>
                
                <p>El segundo tiempo no fue diferente. Los Alebrijes mantuvieron su intensidad y control del partido desde el reinicio. A los 15 minutos del segundo tiempo, el equipo amplió la ventaja con el cuarto gol, consolidando su dominio absoluto en el campo.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada4.jpg" alt="Cuarta jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada5.jpg" alt="Quinta jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Los goles continuaron llegando. El quinto tanto llegó en el minuto 68, producto de una jugada rápida y efectiva que descolocó completamente a la defensa rival. Aunque Aguilas logró descontar en el minuto 75, los Alebrijes respondieron inmediatamente con el sexto gol que selló definitivamente la victoria.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada6.jpg" alt="Sexta jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/Jugada7.jpg" alt="Séptima jugada del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/FinalizaElPartido.jpg" alt="Final del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <h3>Una actuación para el recuerdo</h3>
                
                <p>El director técnico destacó la actitud y el rendimiento del equipo: "Estamos muy contentos con el resultado. El equipo mostró compromiso, trabajo en conjunto y una actitud positiva durante todo el encuentro. Los jugadores ejecutaron el plan de juego a la perfección, manteniendo la intensidad desde el primer hasta el último minuto. Esto es fruto del esfuerzo diario y la dedicación que demuestran en cada entrenamiento."</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/FinPartido.jpg" alt="Celebración final del partido" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Con esta victoria contundente por 6-1, los Alebrijes de Oaxaca Teotihuacán se consolidan en los primeros lugares de la tabla y demuestran que son uno de los equipos más sólidos y competitivos de la Liga TDP. La goleada no solo refleja la calidad individual de los jugadores, sino también el excelente trabajo colectivo y la cohesión del grupo.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/EquipoAguilasTeotihuacán.jpg" alt="Equipo Aguilas de Teotihuacán" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El equipo mantiene sus aspiraciones de cara a las siguientes jornadas del torneo, y esta victoria servirá como un importante impulso anímico y de confianza para continuar luchando por los primeros puestos de la clasificación.</p>
                
                <h3>Desglose de goles y momentos clave</h3>
                
                <p>El primer gol llegó a los 12 minutos del primer tiempo, producto de una combinación perfecta entre el mediocampo y la delantera que encontró espacios en la defensa rival. Este gol temprano marcó el ritmo del encuentro y dio confianza al equipo para seguir adelante con su estrategia ofensiva.</p>
                
                <p>El segundo tanto llegó en el minuto 24, tras una jugada por la banda derecha que terminó con un centro preciso al área. El delantero aprovechó perfectamente el pase para marcar el segundo gol del encuentro, aumentando la ventaja y la presión sobre el equipo visitante.</p>
                
                <p>Antes de ir al descanso, llegó el tercer gol en el minuto 42. Una jugada rápida desde el centro del campo encontró al atacante en posición de gol, quien no desperdició la oportunidad y selló un marcador parcial que ya reflejaba la diferencia de juego entre ambos equipos.</p>
                
                <p>Al reiniciar el segundo tiempo, los Alebrijes mantuvieron la intensidad. El cuarto gol llegó en el minuto 60, producto de una jugada de contraataque que demostró la velocidad y efectividad del equipo en transiciones ofensivas rápidas.</p>
                
                <p>El quinto gol del encuentro llegó en el minuto 68, consolidando aún más la ventaja. Aunque el equipo rival logró descontar en el minuto 75, los Alebrijes respondieron de inmediato con el sexto gol en el minuto 78, demostrando que no iban a bajar la guardia hasta el final del encuentro.</p>
                
                <img src="../assets/victoria-contundente-ante-aguilas-de-teotihuacan/XI_Inicial.jpg" alt="Alineación inicial" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <h3>Análisis técnico del encuentro</h3>
                
                <p>Desde el punto de vista técnico, los Alebrijes mostraron un juego colectivo excepcional. La coordinación entre líneas fue notable, con el mediocampo creando constantemente espacios y oportunidades para los delanteros. La defensa también cumplió su papel, manteniendo el orden y recuperando balones de manera efectiva.</p>
                
                <p>El trabajo en equipo fue evidente en cada jugada. Los jugadores mostraron una comunicación excelente, anticipándose a las jugadas y manteniendo la presión constante sobre el rival. Esta cohesión es resultado del trabajo diario en los entrenamientos y la confianza que el cuerpo técnico ha sabido generar en el grupo.</p>
                
                <h3>La importancia de esta victoria</h3>
                
                <p>Esta victoria por 6-1 no es solo importante por los tres puntos obtenidos, sino también por el mensaje que envía al resto de la competencia. Los Alebrijes de Oaxaca Teotihuacán están demostrando que son un equipo serio, competitivo y con ambiciones claras en el torneo.</p>
                
                <p>Para los jugadores, esta goleada representa una inyección de confianza importante. Saber que pueden vencer de manera contundente y mantener un alto nivel de juego durante los 90 minutos es fundamental para enfrentar los próximos desafíos del torneo.</p>
                
                <p>El cuerpo técnico ha destacado la importancia de mantener la humildad y seguir trabajando con la misma intensidad. Cada partido es un nuevo desafío, y esta victoria debe servir como motivación para continuar mejorando día a día.</p>
                
                <p>Los aficionados también han expresado su satisfacción con el rendimiento del equipo. La goleada ha generado gran entusiasmo y expectativa de cara a los próximos encuentros, esperando que el equipo pueda mantener este nivel de juego.</p>
                
                <p>Con esta victoria, los Alebrijes se posicionan como uno de los equipos a tener en cuenta en la Liga TDP, demostrando que tienen la calidad y el compromiso necesario para competir por los primeros lugares de la clasificación.</p>
            `
        },
        'alexis-armando-seleccionado-torneo-del-sol': {
            title: 'Alexis Armando al Torneo del Sol',
            category: 'Liga TDP',
            categoryClass: 'liga-tdp',
            date: '2025-01-25T10:00:00',
            image: '../assets/Noticias/Alexis_Seleccionado_Torneo_Sol/Alexis_Torneo_Sol.jpg',
            imageStyle: 'object-fit: cover; object-position: center top;',
            content: `
                <p>Con gran orgullo y satisfacción, <strong>Alebrijes de Oaxaca Teotihuacán</strong> anuncia que nuestro jugador <strong>Alexis Armando Espinosa Domínguez</strong> ha sido seleccionado para participar en el prestigioso <strong>Torneo del Sol</strong>, representando a la <strong>Liga TDP MX – Grupo 9</strong>.</p>
                
                <p>Esta convocatoria es el resultado del esfuerzo constante, disciplina ejemplar y dedicación que Alexis ha demostrado tanto dentro como fuera de la cancha. Su selección no solo representa un logro personal, sino también un reconocimiento al trabajo formativo que realizamos en nuestro club.</p>
                
                <h3>Un reconocimiento al talento y compromiso</h3>
                
                <p>Alexis Armando Espinosa Domínguez ha sido una pieza fundamental en nuestro equipo de Liga TDP, destacándose por su calidad técnica, visión de juego y compromiso con los valores que representamos. Su selección para el Torneo del Sol es un testimonio de que el trabajo constante y la disciplina rinden frutos.</p>
                
                <img src="../assets/Noticias/Alexis_Seleccionado_Torneo_Sol/Convocatoria_Torneo_Sol_Grupo_9.jpg" alt="Convocatoria Torneo del Sol Grupo 9" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Portar los colores de la Liga TDP MX – Grupo 9 en el Torneo del Sol es una gran responsabilidad y, al mismo tiempo, un honor que refleja el nivel competitivo y la calidad de los jugadores que forman parte de nuestra división. Alexis ha demostrado que tiene las cualidades necesarias para representar dignamente a nuestro grupo en esta importante competencia.</p>
                
                <h3>El Torneo del Sol: Una plataforma de proyección</h3>
                
                <p>El <strong>Torneo del Sol</strong> es uno de los eventos más importantes del fútbol formativo mexicano, reuniendo a los mejores talentos de las diferentes ligas y categorías del país. Esta competencia no solo es una oportunidad para demostrar habilidades, sino también una plataforma de proyección para jóvenes futbolistas que buscan dar el siguiente paso en su carrera profesional.</p>
                
                <img src="../assets/Noticias/Alexis_Seleccionado_Torneo_Sol/Torneo_Del_Sol.jpg" alt="Torneo del Sol" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Para Alexis, esta experiencia será invaluable. Competir en el Torneo del Sol le permitirá medirse ante los mejores jugadores de su categoría, ganar experiencia en un ambiente de alto nivel competitivo y continuar su desarrollo como futbolista integral.</p>
                
                <h3>El camino hacia la selección</h3>
                
                <p>La selección de Alexis no fue casualidad. Durante toda la temporada, nuestro jugador ha mostrado un rendimiento consistente y destacado en cada encuentro. Su capacidad para leer el juego, su técnica depurada y su actitud positiva dentro y fuera del campo lo han convertido en un referente dentro de nuestro equipo.</p>
                
                <p>El cuerpo técnico de Alebrijes de Oaxaca Teotihuacán ha trabajado de cerca con Alexis, identificando sus fortalezas y áreas de mejora, siempre con el objetivo de potenciar su talento y prepararlo para oportunidades como esta. Esta selección valida el trabajo que realizamos día a día en nuestras instalaciones.</p>
                
                <img src="../assets/Noticias/Alexis_Seleccionado_Torneo_Sol/Seleccionados_Torneo_Sol.jpg" alt="Seleccionados Torneo del Sol" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <h3>Mensaje del club</h3>
                
                <p>Desde <strong>Alebrijes de Oaxaca Teotihuacán</strong>, queremos expresar nuestro orgullo y felicidad por esta convocatoria. Alexis representa los valores que defendemos: esfuerzo, disciplina, constancia y pasión por el fútbol. Su selección es un ejemplo para todos nuestros jóvenes jugadores de que con dedicación y trabajo constante, los sueños se pueden alcanzar.</p>
                
                <p>Disfruta cada minuto de esta experiencia, compite con entrega y demuestra el nivel que distingue a nuestro grupo. Estamos seguros de que dejarás en alto al club, a la Liga TDP y a todo el Grupo 9.</p>
                
                <h3>Un reconocimiento al sistema formativo</h3>
                
                <p>La selección de Alexis también es un reconocimiento al sistema formativo de Alebrijes de Oaxaca Teotihuacán. Nuestro compromiso con el desarrollo integral de los jóvenes futbolistas, combinando aspectos técnicos, tácticos, físicos y humanos, se refleja en logros como este.</p>
                
                <p>Este logro no solo beneficia a Alexis, sino que también inspira a todos los jugadores de nuestras Fuerzas Básicas y del equipo de Liga TDP. Les demuestra que el trabajo constante, la disciplina y la dedicación abren puertas a oportunidades importantes en el fútbol profesional.</p>
                
                <h3>Expectativas y apoyo</h3>
                
                <p>Como club, brindamos todo nuestro apoyo a Alexis en esta nueva etapa. Estamos seguros de que aprovechará al máximo esta oportunidad y que representará con orgullo los colores de Alebrijes y del Grupo 9. Su participación en el Torneo del Sol será seguida de cerca por todo el equipo técnico, sus compañeros y la afición.</p>
                
                <p>¡Mucho éxito en el Torneo del Sol, Alexis! Todo el club está contigo y te desea el mayor de los éxitos. Que esta experiencia sea el inicio de muchas más oportunidades en tu carrera futbolística.</p>
                
                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0; color: var(--primary);">¡Felicidades Alexis Armando!</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 0;">Todo Alebrijes de Oaxaca Teotihuacán está orgulloso de ti. ¡Déjanos en alto en el Torneo del Sol!</p>
                </div>
            `
        },
        'alebrijes-expansion-entrena-en-teotihuacan': {
            title: 'Expansión Entrena en Teotihuacán',
            category: 'Club',
            categoryClass: 'club',
            date: '2025-01-26T10:00:00',
            image: '../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.35 PM.jpeg',
            content: `
                <p>En una muestra más de la integración y sinergia entre las diferentes categorías del club, el <strong>equipo de Alebrijes de Oaxaca de la Liga de Expansión MX</strong> realizó una sesión de entrenamiento en nuestras instalaciones de <strong>Teotihuacán</strong>, fortaleciendo los lazos entre el primer equipo y nuestra estructura formativa.</p>
                
                <p>Esta visita representa un momento significativo para nuestro proyecto deportivo, ya que demuestra la unidad y el trabajo conjunto entre todas las categorías del club. El equipo de Expansión MX, que compite en la segunda división del fútbol mexicano, aprovechó nuestras modernas instalaciones para realizar sus sesiones de preparación.</p>
                
                <h3>Un encuentro que fortalece la identidad del club</h3>
                
                <p>La presencia del equipo de Expansión en nuestras instalaciones de Teotihuacán no es solo un hecho logístico, sino un símbolo de la integración y el trabajo en conjunto que caracteriza a Alebrijes. Esta conexión entre el primer equipo y nuestra estructura en Teotihuacán fortalece la identidad del club y demuestra el compromiso con el desarrollo integral del proyecto.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.36 PM (1).jpeg" alt="Entrenamiento del equipo de Expansión" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Durante su estancia, los jugadores del equipo de Expansión pudieron compartir espacios y experiencias con nuestros jugadores de Liga TDP y Fuerzas Básicas, creando un ambiente de aprendizaje mutuo y motivación. Este tipo de interacciones son fundamentales para el desarrollo de los jóvenes talentos, quienes pueden observar de cerca el nivel y la profesionalidad del primer equipo.</p>
                
                <h3>Instalaciones de primer nivel</h3>
                
                <p>Nuestras instalaciones en Teotihuacán cuentan con las condiciones necesarias para albergar entrenamientos de alto nivel. Los campos de entrenamiento, las áreas de trabajo físico y las comodidades disponibles permiten que equipos de diferentes categorías puedan desarrollar sus sesiones de manera óptima.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.36 PM (2).jpeg" alt="Instalaciones de entrenamiento" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.36 PM.jpeg" alt="Sesión de entrenamiento" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El cuerpo técnico del equipo de Expansión destacó la calidad de nuestras instalaciones y el ambiente propicio para el trabajo. La posibilidad de entrenar en un entorno profesional y bien equipado es fundamental para mantener el nivel competitivo que exige la Liga de Expansión MX.</p>
                
                <h3>Sinergia entre categorías</h3>
                
                <p>Este encuentro también representa una oportunidad única para nuestros jugadores de Liga TDP y Fuerzas Básicas. Poder observar y compartir con jugadores del primer equipo les permite visualizar el siguiente escalón en su desarrollo y entender mejor el camino hacia el profesionalismo.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.40 PM.jpeg" alt="Interacción entre equipos" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.41 PM (1).jpeg" alt="Trabajo conjunto" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.41 PM.jpeg" alt="Equipo de Expansión en acción" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>La sinergia entre las diferentes categorías es uno de los pilares fundamentales de nuestro proyecto. Cuando el equipo de Expansión entrena en nuestras instalaciones, se crea un ambiente de unidad y propósito común que beneficia a todo el club.</p>
                
                <h3>Preparación y trabajo conjunto</h3>
                
                <p>Durante su estancia, el equipo de Expansión realizó sesiones de entrenamiento técnico, táctico y físico, aprovechando al máximo nuestras instalaciones. El trabajo realizado fue intenso y profesional, reflejando el compromiso del equipo con su preparación para la competencia.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.42 PM (1).jpeg" alt="Preparación del equipo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.42 PM (2).jpeg" alt="Sesión de trabajo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.42 PM (3).jpeg" alt="Entrenamiento en Teotihuacán" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.42 PM.jpeg" alt="Equipo trabajando" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El intercambio de metodologías y experiencias entre los cuerpos técnicos también es valioso. Nuestros entrenadores pudieron observar de cerca el trabajo del primer equipo, mientras que el equipo de Expansión conoció más sobre nuestro sistema formativo y los valores que inculcamos en nuestros jóvenes.</p>
                
                <h3>Un proyecto unificado</h3>
                
                <p>Este tipo de actividades refuerzan la idea de que Alebrijes es un proyecto unificado, donde todas las categorías trabajan hacia un objetivo común: el desarrollo y la proyección de talento mexicano. La presencia del equipo de Expansión en Teotihuacán es una muestra tangible de esta unidad.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM (1).jpeg" alt="Proyecto unificado" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM (2).jpeg" alt="Trabajo en equipo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM (3).jpeg" alt="Unidad del club" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM (4).jpeg" alt="Equipo de Expansión" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM (5).jpeg" alt="Sesión de entrenamiento" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.43 PM.jpeg" alt="Preparación del equipo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Para nuestros jugadores de Teotihuacán, ver al equipo de Expansión entrenando en sus propias instalaciones es una fuente de inspiración y motivación. Les muestra que forman parte de un proyecto más grande, donde su desarrollo y crecimiento son prioridad.</p>
                
                <h3>El futuro del proyecto</h3>
                
                <p>Este tipo de encuentros sientan las bases para futuras colaboraciones y trabajos conjuntos. La integración entre las diferentes categorías del club es fundamental para crear un ecosistema deportivo sólido y exitoso, donde cada nivel se nutre del otro.</p>
                
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.44 PM (1).jpeg" alt="Futuro del proyecto" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.44 PM (2).jpeg" alt="Desarrollo conjunto" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.44 PM (3).jpeg" alt="Trabajo en instalaciones" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.44 PM (4).jpeg" alt="Equipo de Expansión" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Expansión_En_Teotihuacán/WhatsApp Image 2025-12-30 at 7.35.44 PM.jpeg" alt="Sesión de entrenamiento" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>La visita del equipo de Alebrijes de Oaxaca de Expansión MX a nuestras instalaciones de Teotihuacán es un paso más en la consolidación de nuestro proyecto deportivo. Este tipo de actividades fortalecen los lazos entre todas las categorías y demuestran que Alebrijes es más que un club: es una familia unida por la pasión del fútbol y el compromiso con el desarrollo del talento mexicano.</p>
                
                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0; color: var(--primary);">Un proyecto unificado</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 0;">La integración entre todas las categorías fortalece nuestro compromiso con el desarrollo del fútbol mexicano.</p>
                </div>
            `
        },
        'draft-cl-2026-seleccion-talentos': {
            title: 'Draft CL 2026: Selección de Talentos',
            category: 'Club',
            categoryClass: 'club',
            date: '2025-01-27T10:00:00',
            image: '../assets/Noticias/Draft_CL_2026/600915227_880335767858850_5268943101367662221_n.jpg',
            content: `
                <p>Con gran satisfacción, <strong>Alebrijes de Oaxaca Teotihuacán</strong> y <strong>Soles Teotihuacán</strong> anuncian que sus jugadores participaron exitosamente en el <strong>Draft CL 2026</strong>, un proceso de revisión deportiva de dos días diseñado para identificar y seleccionar talentos que puedan integrarse al equipo de <strong>Liga de Expansión MX</strong> o al equipo de <strong>Liga TDP</strong>.</p>
                
                <p>Este proceso de selección representa una oportunidad única para nuestros jugadores de demostrar sus capacidades técnicas, tácticas, físicas y mentales ante los evaluadores del club, con el objetivo de dar el siguiente paso en su carrera profesional dentro de nuestra estructura deportiva.</p>
                
                <h3>Un proceso riguroso de dos días</h3>
                
                <p>El Draft CL 2026 se desarrolló durante dos días intensos de evaluación, donde los jugadores fueron sometidos a diversas pruebas y ejercicios diseñados para medir su nivel actual y su potencial de desarrollo. Este proceso exhaustivo permitió a los evaluadores tener una visión completa de las capacidades de cada participante.</p>
                
                <p>Durante el primer día, los jugadores realizaron pruebas físicas y técnicas que evaluaron aspectos fundamentales como velocidad, resistencia, fuerza, control de balón, precisión en el pase y capacidad de juego en espacios reducidos. Estas evaluaciones iniciales permitieron identificar a los candidatos con mayor potencial.</p>
                
                <img src="../assets/Noticias/Draft_CL_2026/600955378_880335944525499_7172097451575413202_n.jpg" alt="Pruebas del Draft CL 2026" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Draft_CL_2026/600218485_880335834525510_1025694528344175711_n.jpg" alt="Draft CL 2026 - Proceso de selección" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El segundo día se enfocó en evaluaciones tácticas y de juego real, donde los jugadores participaron en partidos controlados y ejercicios de situación que permitieron observar su capacidad de toma de decisiones, visión de juego, trabajo en equipo y adaptabilidad a diferentes sistemas tácticos.</p>
                
                <h3>Los seleccionados</h3>
                
                <p>Tras un riguroso proceso de evaluación, fueron seleccionados los siguientes jugadores que demostraron las cualidades necesarias para integrarse a nuestros equipos profesionales:</p>
                
                <div style="background-color: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px; padding: 20px; margin: 30px 0;">
                    <h4 style="color: var(--primary); margin-top: 0;">Jugadores de Alebrijes Teotihuacán:</h4>
                    <ul style="list-style-type: none; padding: 0; margin: 0 0 20px 0;">
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--primary); font-weight: bold;">•</span>
                            <strong>Deivid Fuentes</strong>
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--primary); font-weight: bold;">•</span>
                            <strong>Alejandro Espíritu</strong>
                        </li>
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--primary); font-weight: bold;">•</span>
                            <strong>Marvin Echeverría</strong>
                        </li>
                    </ul>
                    <h4 style="color: var(--primary); margin-top: 20px;">Jugadores de Soles Teotihuacán:</h4>
                    <ul style="list-style-type: none; padding: 0; margin: 0;">
                        <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--primary); font-weight: bold;">•</span>
                            <strong>Jorshua Rodríguez</strong>
                        </li>
                    </ul>
                </div>
                
                <img src="../assets/Noticias/Draft_CL_2026/600962865_880335781192182_2487354025911618264_n.jpg" alt="Jugadores seleccionados" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Draft_CL_2026/600968847_880335794525514_7568511434903492227_n.jpg" alt="Selección Draft CL 2026" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <h3>Un reconocimiento al trabajo y dedicación</h3>
                
                <p>La selección de estos jugadores es el resultado de su esfuerzo constante, dedicación y compromiso con el desarrollo deportivo. Cada uno de ellos ha demostrado durante el proceso de evaluación que posee las cualidades técnicas, tácticas y humanas necesarias para formar parte de nuestros equipos profesionales.</p>
                
                <img src="../assets/Noticias/Draft_CL_2026/601027303_880335897858837_5214505692885786264_n.jpg" alt="Reconocimiento a los jugadores" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                <img src="../assets/Noticias/Draft_CL_2026/601379743_880335854525508_4542332459359186947_n.jpg" alt="Proceso de selección" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Para estos jóvenes futbolistas, ser seleccionados en el Draft CL 2026 representa una oportunidad única de continuar su desarrollo en un ambiente profesional y competitivo. Su integración a los equipos de Liga de Expansión MX o Liga TDP les permitirá seguir creciendo y desarrollando su potencial al máximo nivel.</p>
                
                <h3>El proceso de integración</h3>
                
                <p>Los jugadores seleccionados ahora iniciarán un proceso de integración a sus respectivos equipos, donde recibirán el apoyo necesario para adaptarse al nuevo nivel competitivo. Este proceso incluye trabajo técnico, táctico y físico específico, así como orientación sobre los valores y la filosofía del club.</p>
                
                <img src="../assets/Noticias/Draft_CL_2026/601493544_880335811192179_8479833009290183758_n.jpg" alt="Integración de jugadores" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El cuerpo técnico de cada equipo trabajará de cerca con los nuevos integrantes para asegurar que su transición sea exitosa y que puedan contribuir de manera efectiva a los objetivos del equipo desde el primer momento.</p>
                
                <h3>Video del proceso</h3>
                
                <p>A continuación, compartimos un video que documenta parte del proceso de evaluación del Draft CL 2026, mostrando el trabajo y la dedicación de todos los participantes:</p>
                
                <div style="width: 100%; max-width: 800px; margin: 30px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <video controls style="width: 100%; height: auto; display: block;">
                        <source src="../assets/Noticias/Draft_CL_2026/FDownloader.Net_AQPuqmMEnnfVdvRkLynuPX9fJwZae3LWKkElHWUxvt9NPSsQbkfbYpd8WB_577mNvzbHesYy0pcfIx6B5SUZnYoFjlYafOqkHBTB9vh3rlVugQ_720p_(HD).mp4" type="video/mp4">
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                </div>
                
                <h3>Un paso más en el desarrollo del talento</h3>
                
                <p>El Draft CL 2026 es una muestra más del compromiso de Alebrijes de Oaxaca Teotihuacán y Soles Teotihuacán con el desarrollo y la proyección del talento mexicano. Este tipo de procesos permiten identificar y potenciar a los jugadores con mayor potencial, brindándoles las herramientas y oportunidades necesarias para alcanzar sus objetivos deportivos.</p>
                
                <p>Para los jugadores seleccionados, este es solo el comienzo de un nuevo capítulo en su carrera. Con dedicación, trabajo constante y el apoyo del club, tienen la oportunidad de consolidarse como futbolistas profesionales y contribuir al éxito de nuestros equipos.</p>
                
                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0; color: var(--primary);">¡Felicidades a los seleccionados!</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 0;">Todo el club está orgulloso de ustedes. Que este logro sea el inicio de grandes éxitos en su carrera profesional.</p>
                </div>
            `
        },
        'preparacion-debut-liga-tdp-clausura-2026': {
            title: 'Preparación para Debut en Liga TDP',
            category: 'Liga TDP',
            categoryClass: 'liga-tdp',
            date: '2025-01-28T10:00:00',
            image: '../assets/Noticias/Preparación_Para_El_Debut_En_El_Clausura_2026/611672315_26248273021441267_7472245763015193747_n.jpg',
            content: `
                <p>Con gran expectativa y preparación, <strong>Alebrijes de Oaxaca Teotihuacán</strong> se alista para su debut en la <strong>Jornada 16 del Clausura 2026</strong> de la <strong>Liga TDP</strong>, enfrentando a <strong>Bombarderos de Tecámac</strong> en un encuentro que marca un momento importante en la temporada.</p>
                
                <p>El equipo ha trabajado intensamente durante las últimas semanas, preparándose física, técnica y tácticamente para este importante compromiso. La jornada 16 representa un punto crucial en el torneo, y el equipo está decidido a demostrar su mejor versión en el campo.</p>
                
                <h3>Preparación intensiva para el encuentro</h3>
                
                <p>Durante los días previos al partido, el cuerpo técnico ha diseñado un plan de trabajo específico enfocado en las características del rival y en potenciar las fortalezas del equipo. Las sesiones de entrenamiento han sido intensas y productivas, con un enfoque especial en la coordinación táctica y la preparación física.</p>
                
                <img src="../assets/Noticias/Preparación_Para_El_Debut_En_El_Clausura_2026/613363240_26248274058107830_8001289920438829232_n.jpg" alt="Preparación del equipo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>Los jugadores han mostrado un gran compromiso y dedicación en cada sesión de entrenamiento. El ambiente de trabajo ha sido positivo y enfocado, con todos los integrantes del equipo conscientes de la importancia de este encuentro y de la necesidad de dar lo mejor de sí mismos.</p>
                
                <h3>Análisis del rival: Bombarderos de Tecámac</h3>
                
                <p>Bombarderos de Tecámac es un equipo con experiencia en la Liga TDP y que siempre presenta un desafío importante. El cuerpo técnico ha realizado un análisis exhaustivo del rival, identificando sus fortalezas y áreas de oportunidad para diseñar una estrategia que permita al equipo obtener un resultado positivo.</p>
                
                <p>El equipo conoce la importancia de respetar al rival pero también de confiar en sus propias capacidades. La preparación ha incluido trabajo específico para contrarrestar las características principales del equipo visitante, mientras se refuerzan los aspectos del juego que han funcionado bien durante la temporada.</p>
                
                <h3>El trabajo en equipo como base del éxito</h3>
                
                <p>Uno de los aspectos más destacados de la preparación ha sido el trabajo en equipo. Los jugadores han demostrado una excelente comunicación y coordinación en los entrenamientos, aspectos fundamentales para lograr un buen rendimiento en el partido. La cohesión del grupo es una de las fortalezas que el equipo busca aprovechar en el encuentro.</p>
                
                <img src="../assets/Noticias/Preparación_Para_El_Debut_En_El_Clausura_2026/611672315_26248273021441267_7472245763015193747_n.jpg" alt="Trabajo en equipo" style="width: 100%; height: auto; border-radius: 8px; margin: 30px 0;">
                
                <p>El director técnico ha enfatizado la importancia de mantener la unidad y el apoyo mutuo durante todo el encuentro. En un partido de Liga TDP, donde la intensidad y la competitividad son altas, el trabajo colectivo es fundamental para superar los desafíos que se presenten durante los 90 minutos.</p>
                
                <h3>Preparación física y mental</h3>
                
                <p>Además del trabajo técnico y táctico, el equipo ha dedicado tiempo importante a la preparación física y mental. Los jugadores han trabajado en su condición física para asegurar que puedan mantener un alto nivel de intensidad durante todo el partido, mientras que también se ha trabajado en aspectos psicológicos como la concentración, la confianza y la capacidad de manejar la presión.</p>
                
                <p>La preparación mental es tan importante como la física y técnica. Los jugadores han trabajado en mantener la calma bajo presión, en tomar buenas decisiones en momentos clave y en mantener una actitud positiva independientemente de cómo se desarrolle el encuentro.</p>
                
                <h3>Expectativas y objetivos</h3>
                
                <p>El equipo llega a este encuentro con expectativas claras y objetivos definidos. El objetivo principal es obtener un resultado positivo que permita continuar acumulando puntos importantes en la tabla de clasificación. Sin embargo, más allá del resultado, el equipo busca demostrar su identidad de juego y su compromiso con los valores del club.</p>
                
                <p>El cuerpo técnico ha transmitido a los jugadores la importancia de disfrutar el momento, de competir con intensidad y de dejar todo en la cancha. Cada partido es una oportunidad de crecimiento y aprendizaje, y este encuentro no es la excepción.</p>
                
                <h3>El apoyo de la afición</h3>
                
                <p>El equipo cuenta con el apoyo incondicional de la afición, que siempre ha estado presente en los momentos importantes. El respaldo de los aficionados es una fuente de motivación adicional para los jugadores, quienes saben que tienen el apoyo de toda la familia Alebrije en cada encuentro.</p>
                
                <p>La afición juega un papel fundamental en el éxito del equipo. Su apoyo, tanto en las buenas como en las malas, es un pilar importante que fortalece al grupo y les da la confianza necesaria para enfrentar cualquier desafío.</p>
                
                <h3>Un momento importante en la temporada</h3>
                
                <p>La Jornada 16 del Clausura 2026 representa un momento importante en la temporada. Con el torneo avanzando, cada punto se vuelve más valioso y cada resultado puede tener un impacto significativo en la clasificación. El equipo es consciente de esto y está preparado para dar lo mejor de sí mismo.</p>
                
                <p>El encuentro ante Bombarderos de Tecámac será una prueba importante que permitirá medir el nivel actual del equipo y su capacidad para competir al más alto nivel en la Liga TDP. Con una preparación adecuada y el compromiso de todos, el equipo está listo para enfrentar este desafío.</p>
                
                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0; color: var(--primary);">¡Vamos Alebrijes!</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 0;">Todo el equipo está preparado y listo para dar lo mejor en este importante encuentro. ¡A por la victoria!</p>
                </div>
            `
        }
        // Add more news here as needed
    };

    // Load news content
    const news = newsDatabase[newsSlug];
    const contentContainer = document.getElementById('news-detail-content');

    if (!news) {
        contentContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2>Noticia no encontrada</h2>
                <p>La noticia que buscas no existe o ha sido eliminada.</p>
                <a href="noticias.html" class="news-detail-back" style="margin-top: 20px;">
                    Volver a Noticias
                </a>
            </div>
        `;
        return;
    }

    // Calculate relative time
    const getRelativeTime = (dateString) => {
        if (!dateString) return '1d';

        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffHours < 24) {
            return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
        } else if (diffDays < 30) {
            return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
        } else {
            const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            return months[date.getMonth()];
        }
    };

    // Render news content
    const relativeTime = getRelativeTime(news.date);

    contentContainer.innerHTML = `
        <div class="news-detail-header">
            <div class="news-detail-meta">
                <span class="news-detail-category ${news.categoryClass}">${news.category}</span>
                <span>|</span>
                <span>${relativeTime}</span>
            </div>
            <h1 class="news-detail-title">${news.title.toUpperCase()}</h1>
        </div>
        
        <img src="${news.image}" alt="${news.title}" class="news-detail-image" style="${news.imageStyle || 'object-fit: cover;'}">
        
        <div class="news-detail-content">
            ${news.content}
        </div>
    `;

    // Update page title
    document.title = `${news.title} | Alebrijes de Oaxaca Teotihuacán`;

    // Initialize Related News Carousel
    initRelatedNewsCarousel(newsSlug);
});

// Initialize Related News Carousel
function initRelatedNewsCarousel(currentSlug) {
    const carousel = document.getElementById('related-news-carousel');
    const prevBtn = document.getElementById('related-carousel-prev');
    const nextBtn = document.getElementById('related-carousel-next');

    if (!carousel) return;

    // Generate related news from newsDatabase
    const relatedNewsData = Object.keys(newsDatabase)
        .filter(slug => slug !== currentSlug)
        .map(slug => {
            const item = newsDatabase[slug];
            // Get a simple relative time or date
            const date = new Date(item.date);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const formattedDate = `${date.getDate()} ${months[date.getMonth()]}`;

            return {
                slug: slug,
                title: item.title,
                category: item.category,
                image: item.image,
                time: formattedDate
            };
        }).slice(0, 6);

    if (relatedNewsData.length === 0) {
        carousel.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-light);">No hay más noticias disponibles.</p>';
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // Populate carousel
    relatedNewsData.forEach(item => {
        const carouselItem = document.createElement('a');
        carouselItem.href = `noticia-detalle.html?noticia=${item.slug}`;
        carouselItem.className = 'related-news-item';
        carouselItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="related-news-item-image">
            <div class="related-news-item-content">
                <div class="related-news-item-meta">
                    <span>${item.time}</span>
                    <span>|</span>
                    <span>${item.category}</span>
                </div>
                <h3 class="related-news-item-title">${item.title.toUpperCase()}</h3>
            </div>
        `;
        carousel.appendChild(carouselItem);
    });

    // Carousel navigation
    let scrollAmount = 0;
    const scrollStep = 344; // 320px width + 24px gap

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollAmount = Math.max(0, scrollAmount - scrollStep);
            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            updateCarouselButtons();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            updateCarouselButtons();
        });
    }

    function updateCarouselButtons() {
        if (prevBtn) {
            prevBtn.disabled = scrollAmount <= 0;
        }
        if (nextBtn) {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            nextBtn.disabled = scrollAmount >= maxScroll - 10;
        }
    }

    // Update buttons on scroll
    carousel.addEventListener('scroll', () => {
        scrollAmount = carousel.scrollLeft;
        updateCarouselButtons();
    });

    // Initial button state
    updateCarouselButtons();
}


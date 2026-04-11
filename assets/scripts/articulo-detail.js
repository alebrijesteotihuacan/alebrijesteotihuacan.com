/* 
   Alebrijes de Oaxaca Teotihuacán
   Article Detail Page Script - Loads article content based on URL parameter
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get article slug from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleSlug = urlParams.get('articulo') || '';

    if (!articleSlug) {
        // No slug provided, redirect to articles page
        window.location.href = 'articulos.html';
        return;
    }

    // Article database - Placeholder content for the 8 articles
    const articleDatabase = {
        'que-es-la-liga-tdp': {
            title: '¿Qué es la Liga TDP?',
            date: '2025-01-20T10:00:00',
            image: '../assets/Articulos/que_es_la_liga_tdp/portada.png',
            imageStyle: 'object-fit: contain; background-color: #f5f5f5; padding: 40px;',
            content: `
                <p>La <strong>Liga TDP</strong> (Tercera División Profesional) representa la <strong>cuarta categoría</strong> dentro del sistema de ligas de fútbol profesional en México. A pesar de su nombre histórico, es el escalón fundamental donde inicia el sueño profesional de miles de jóvenes futbolistas en el país.</p>

                <h3>Historia y Evolución</h3>
                <p>Fundada en <strong>1967</strong>, la liga ha sido el semillero más importante del balompié nacional. Originalmente fue la tercera categoría del fútbol mexicano hasta 1982. A lo largo de sus más de 50 años de historia, equipos legendarios y figuras consagradas del fútbol mexicano dieron sus primeros pasos en estas canchas.</p>
                
                <p>En 2018, la división se renovó completamente, adoptando el nombre de <strong>Liga TDP</strong> y modernizando su estructura para profesionalizar aún más el desarrollo de los clubes y jugadores.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <img src="../assets/Articulos/que_es_la_liga_tdp/Liga_TDP_logo.svg.png" alt="Logo Liga TDP" style="max-width: 300px; width: 100%; height: auto;">
                </div>

                <h3>Formato de Competencia</h3>
                <p>La Liga TDP es el torneo profesional con mayor participación en México, contando con alrededor de <strong>240 equipos</strong> divididos en 17 grupos por zonas geográficas (Zona A y Zona B). Este formato regionalizado permite reducir costos de traslado y fomenta las rivalidades locales.</p>
                
                <p>El sistema de competencia se divide en:</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                    <li><strong>Fase Regular:</strong> Torneo anual a visita recíproca dentro de cada grupo.</li>
                    <li><strong>Fase Final (Liguilla):</strong> Los mejores equipos de cada grupo clasifican a una etapa de eliminación directa nacional.</li>
                </ul>

                <p>Un aspecto único de esta liga es que, en caso de empate en la fase regular, se disputa un punto extra en tanda de penales, añadiendo emoción y competitividad a cada encuentro.</p>

                <h3>Alebrijes Teotihuacán y la Liga TDP</h3>
                <p><strong>Alebrijes de Oaxaca Teotihuacán</strong> participa orgullosamente en esta división, formando parte del <strong>Grupo 9</strong>. Nuestra participación no es solo competitiva, sino estratégica.</p>
                
                <p>Como equipo filial de <strong>Alebrijes de Oaxaca FC</strong> (perteneciente a la <a href="articulo-detalle.html?articulo=liga-expansion-mx" style="color: var(--primary); font-weight: bold;">Liga de Expansión MX</a>), nuestro principal objetivo es la <strong>formación y proyección</strong> de talento.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <img src="../assets/Articulos/que_es_la_liga_tdp/FMF_Logo.png" alt="Federación Mexicana de Fútbol" style="max-width: 200px; width: 100%; height: auto;">
                </div>

                <p>Ser parte de la Liga TDP nos permite:</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                    <li>Dar fogueo profesional a jugadores jóvenes (categorías 2003-2009).</li>
                    <li>Servir como puente directo hacia el primer equipo en Liga de Expansión.</li>
                    <li>Competir al más alto nivel formativo del país.</li>
                </ul>

                <p>Para nuestros jugadores, pisar la cancha en la Liga TDP significa portar los colores de Alebrijes con orgullo, sabiendo que están en la plataforma ideal para ser vistos y dar el salto al siguiente nivel del fútbol profesional.</p>
            `
        },
        'que-es-una-visoria': {
            title: '¿Qué es una visoria?',
            date: '2025-01-19T10:00:00',
            image: '../assets/Articulos/que_es_una_visoria/portada.jpg',
            content: `
                <p>Una <strong>visoria de fútbol</strong> es mucho más que un simple entrenamiento; es el <strong>examen crucial</strong> donde los sueños de los jóvenes futbolistas se encuentran con la realidad del deporte profesional. Es el proceso oficial mediante el cual los clubes identifican, evalúan y seleccionan talento nuevo para integrar sus Fuerzas Básicas.</p>

                <h3>¿Qué evalúan los visores?</h3>
                <p>Durante una visoria, el cuerpo técnico y los reclutadores observan minuciosamente cuatro pilares fundamentales:</p>
                
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>1. Aspecto Técnico:</strong> Control de balón, golpeo, recepción orientada, conducción y calidad en el pase. No solo se busca habilidad, sino la correcta ejecución de los fundamentos bajo presión.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>2. Aspecto Táctico:</strong> Inteligencia de juego. ¿Cómo se mueve el jugador sin balón? ¿Entiende su posición? ¿Toma buenas decisiones (cuándo pasar, cuándo driblar)?
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>3. Aspecto Físico:</strong> Resistencia, velocidad, fuerza y coordinación. El fútbol moderno exige atletas completos capaces de mantener la intensidad durante todo el partido.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>4. Aspecto Mental:</strong> Actitud, liderazgo y resiliencia. Buscamos jugadores que no se rindan ante el error, que animen a sus compañeros y muestren disciplina y respeto en todo momento.
                    </li>
                </ul>

                <h3>El Proceso en Alebrijes</h3>
                <p>En <strong>Alebrijes de Oaxaca Teotihuacán</strong>, nuestras visorias son puertas abiertas a la oportunidad. Buscamos jóvenes con "hambre" de triunfo, que deseen formarse bajo nuestra metodología y valores.</p>
                
                <p>No buscamos al jugador perfecto, buscamos al jugador con <strong>potencial</strong>. Aquel que con el entrenamiento adecuado y nuestra infraestructura, pueda convertirse en el profesional del mañana.</p>
                
                <h3>Consejos para tu próxima visoria</h3>
                <p>Si planeas asistir a una de nuestras convocatorias, recuerda:</p>
                <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 20px;">
                    <li>Llega puntual y con la indumentaria adecuada (blanco habitualmente).</li>
                    <li>Hidrátate bien y descansa la noche anterior.</li>
                    <li>Juega simple: los visores valoran más la efectividad que los lujos innecesarios.</li>
                    <li>Muestra siempre una actitud positiva y competitiva.</li>
                </ul>
            `
        },
        'que-es-una-casa-club': {
            title: 'Casa Club',
            date: '2025-01-18T10:00:00',
            image: '../assets/Articulos/que_es_una_casa_club/portada.jpg',
            content: `
                <h2 style="color: var(--primary); text-align: center; font-size: 2rem; margin-bottom: 10px;">Tu Hogar <span style="color: var(--dark);">Alebrije</span></h2>
                <p style="text-align: center; font-style: italic; margin-bottom: 30px; font-size: 1.1rem; color: #666;">Más que una residencia, un espacio de desarrollo integral para nuestros talentos.</p>

                <h3>Desarrollo Integral</h3>
                <p>En Alebrijes Teotihuacán, entendemos que el talento puede venir de cualquier rincón del país. Nuestra Casa Club está diseñada para ofrecer un ambiente seguro, cómodo y disciplinado donde los jóvenes futbolistas pueden concentrarse 100% en su desarrollo deportivo y académico.</p>
                <p>Contamos con supervisión las 24 horas, planes nutricionales y apoyo académico para garantizar el crecimiento personal de nuestros jugadores.</p>

                <h3>Beneficios de Casa Club</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Alimentación:</strong> Dieta balanceada con control de carbohidratos, vegetales y proteína. Tres alimentos por día (Desayuno, Comida, Cena). <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">LUNES A SÁBADO</span>
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Hospedaje:</strong> Alojamiento seguro en habitaciones compartidas. Cuenta con control de acceso a instalaciones y cámaras de vigilancia 24/7. <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">INCLUIDO</span>
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Lavandería:</strong> Servicio de lavandería gratuito, 1 carga de ropa por semana. <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">GRATUITO</span>
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Fisioterapeuta:</strong> Atención especializada y personalizada con uso de aparatos médicos profesionales. <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">PROFESIONAL</span>
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Entrenamiento:</strong> Alto rendimiento (+20 hrs semanales). Entrenadores certificados por la FMF. Incluye material deportivo, hidratación y uso de alberca para entrenamiento de rehabilitación muscular y acondicionamiento físico. <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">DOBLE SESIÓN</span>
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong><span style="font-size: 1.2em;"></span> Formación Académica:</strong> Beca del 100% vía convenio con el Instituto Azteca de Formación Empresarial. Certificación oficial SEP al concluir. <br><span style="font-size: 0.85em; color: var(--primary); font-weight: 600;">SECUNDARIA • BACHILLERATO • LICENCIATURA</span>
                    </li>
                </ul>

                <h3>Valores de Convivencia</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; text-align: center; margin-bottom: 30px;">
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">Disciplina</h4>
                        <p style="margin: 0;">Respeto a los horarios y reglamentos internos.</p>
                    </div>
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">Limpieza</h4>
                        <p style="margin: 0;">Cuidado de los espacios personales y comunes.</p>
                    </div>
                    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h4 style="color: var(--primary); margin-bottom: 10px;">Compañerismo</h4>
                        <p style="margin: 0;">Crear una familia lejos de casa.</p>
                    </div>
                </div>

                <h3>Conexión con Alebrijes de Oaxaca Teotihuacán</h3>
                <p>La Casa Club es mucho más que una residencia; es el <strong>corazón de nuestra identidad</strong>. Vivir aquí significa respirar la filosofía de Alebrijes las 24 horas del día. Esta inmersión total fortalece el sentido de pertenencia y acelera la adaptación al modelo de juego y valores del club.</p>
                <p>Es la relación directa entre la promesa y la realidad profesional: nuestros residentes son los primeros en ser observados para promociones a categorías superiores (Liga TDP y proyección a Expansión MX), convirtiendo a la Casa Club en el semillero oficial de nuestras futuras leyendas.</p>
            `
        },
        'que-es-la-fmf': {
            title: '¿Qué es la FMF?',
            date: '2025-01-17T10:00:00',
            image: '../assets/Articulos/que_es_la_fmf/portada.png',
            imageStyle: 'object-fit: contain; background-color: #f5f5f5; padding: 40px;',
            content: `
                <p>La <strong>Federación Mexicana de Fútbol Asociación, A.C. (FMF)</strong> es el organismo rector encargado de la organización, reglamentación, administración, promoción y difusión del fútbol en México. Fundada el 23 de agosto de 1922, es la institución que vela por el desarrollo de este deporte en todos sus niveles, desde el sector amateur hasta las ligas profesionales y las Selecciones Nacionales.</p>

                <h3>Afiliaciones Internacionales</h3>
                <p>La FMF es miembro titular de la <strong>FIFA</strong> (Federación Internacional de Fútbol Asociación) desde 1929 y de la <strong>CONCACAF</strong> (Confederación de Norteamérica, Centroamérica y el Caribe de Fútbol) desde 1961, lo que avala y certifica todas las competencias oficiales en territorio mexicano.</p>

                <h3>Su Estructura y Función</h3>
                <p>La Federación no solo gestiona a la <strong>Selección Nacional de México</strong> en todas sus categorías (Mayor, Femenil, Menores, Playa y Sala), sino que también supervisa el correcto funcionamiento de las ligas profesionales:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid var(--primary);">Liga BBVA MX</li>
                    <li style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid var(--primary);">Liga BBVA Expansión MX</li>
                    <li style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid var(--primary);">Liga Premier</li>
                    <li style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid var(--primary);"><strong>Liga TDP (Tercera División Profesional)</strong></li>
                    <li style="margin-bottom: 10px; padding-left: 15px; border-left: 3px solid var(--primary);">Sector Amateur</li>
                </ul>

                <h3>Compromiso con el Desarrollo</h3>
                <p>A través de sus distintas comisiones (Árbitros, Disciplinaria, Conciliación, etc.), la FMF garantiza el juego limpio y la integridad deportiva. Para equipos como <strong>Alebrijes de Oaxaca Teotihuacán</strong>, estar afiliados a la FMF (vía Liga TDP) significa formar parte del camino oficial hacia la profesionalización y el alto rendimiento regulado.</p>
            `
        },
        'liga-expansion-mx': {
            title: 'Liga de Expansión MX',
            date: '2025-01-16T10:00:00',
            image: '../assets/Articulos/liga_expansion_mx/portada.png',
            imageStyle: 'object-fit: contain; background-color: #f5f5f5; padding: 40px;',
            content: `
                <p>La <strong>Liga de Expansión MX</strong>, fundada en 2020, es la segunda categoría del sistema de ligas de fútbol en México. Surgió con el objetivo principal de rescatar a los equipos de la antigua Liga de Ascenso con problemas financieros y, fundamentalmente, para servir como un <strong>semillero de talento</strong> para la Primera División.</p>

                <h3>Objetivos Principales</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Desarrollo de Jóvenes:</strong> La liga tiene reglas que fomentan la participación de jugadores menores de 23 años, permitiendo que las futuras estrellas sumen minutos y experiencia profesional en un entorno competitivo.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Estabilidad Financiera:</strong> Se implementaron controles económicos estrictos para asegurar que los clubes sean viables y sostenibles a largo plazo.
                    </li>
                </ul>

                <h3>La Conexión con Alebrijes</h3>
                <p>Para nuestra institución, la Liga de Expansión es el siguiente gran paso en la pirámide de desarrollo. Nuestros jugadores destacados en la <strong>Liga TDP</strong> tienen la proyección directa hacia nuestro primer equipo en esta categoría, demostrando que en <strong>Alebrijes de Oaxaca</strong>, el camino hacia la élite es una realidad tangible.</p>
            `
        },
        'proceso-oficial-de-visorias-en-alebrijes-de-oaxaca': {
            title: 'Proceso oficial de visorias en Alebrijes de Oaxaca',
            date: '2025-01-15T10:00:00',
            image: '../assets/Nosotros/img-entrenamiento-velocidad.jpg',
            content: `
                <p>El proceso oficial de visorías en <strong>Alebrijes de Oaxaca Teotihuacán</strong> es la puerta de entrada para los jóvenes talentos que sueñan con el profesionalismo. Nuestro sistema de captación está diseñado para identificar no solo habilidades técnicas, sino también el carácter y la disciplina necesarios para el alto rendimiento.</p>

                <h3>Requisitos Generales</h3>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--primary); font-size: 1.2rem;">&#128196;</span>
                        <div><strong>Documentación:</strong> Acta de nacimiento (copia), CURP y responsiva firmada (descargable en el registro).</div>
                    </li>
                    <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--primary); font-size: 1.2rem;">&#128085;</span>
                        <div><strong>Vestimenta:</strong> Playera blanca, short blanco y calcetas blancas (sin escudos de otros equipos). Canilleras y zapatos de fútbol obligatorios.</div>
                    </li>
                    <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <span style="color: var(--primary); font-size: 1.2rem;">&#128336;</span>
                        <div><strong>Puntualidad:</strong> Llegar al menos 30 minutos antes de la hora citada para el registro en campo.</div>
                    </li>
                </ul>
                
                <h3>Etapas del Proceso</h3>
                <p>Nuestras visorías se dividen en filtros progresivos para evaluar a fondo el potencial de cada jugador:</p>

                <div style="margin-top: 20px;">
                    <h4 style="color: var(--dark); border-bottom: 2px solid var(--primary); display: inline-block; padding-bottom: 5px;">1. Registro Digital</h4>
                    <p>Todo aspirante debe completar el formulario oficial de visorías. Esto nos permite organizar las categorías y contactarte directamente.</p>
                    
                    <h4 style="color: var(--dark); border-bottom: 2px solid var(--primary); display: inline-block; padding-bottom: 5px; margin-top: 20px;">2. Pruebas Físicas y Técnicas</h4>
                    <p>Evaluación de capacidades condicionales (velocidad, resistencia) y manejo de balón. Buscamos jugadores con buena base atlética y fundamentos sólidos.</p>

                    <h4 style="color: var(--dark); border-bottom: 2px solid var(--primary); display: inline-block; padding-bottom: 5px; margin-top: 20px;">3. Pruebas de Fútbol (Interescuadras)</h4>
                    <p>Partidos controlados donde se evalúa la inteligencia táctica, la toma de decisiones bajo presión y el juego en equipo.</p>

                    <h4 style="color: var(--dark); border-bottom: 2px solid var(--primary); display: inline-block; padding-bottom: 5px; margin-top: 20px;">4. Filtro Final</h4>
                    <p>Los seleccionados entrenarán unos días con el equipo piloto o la categoría correspondiente para medir su adaptación al nivel del grupo.</p>
                </div>

                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0;">¿Estás listo para el reto?</h3>
                    <p>Consulta las próximas fechas y sedes en nuestro portal oficial de visorías.</p>
                    <a href="../webvisorias/FormularioDeRegistroVisoria-main/index.html" target="_blank" style="display: inline-block; background-color: var(--primary); color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; transition: background 0.3s;">REGÍSTRATE AQUÍ</a>
                </div>
            `
        },
        'fuerzas-basicas': {
            title: 'Fuerzas Básicas',
            date: '2025-01-14T10:00:00',
            image: '../assets/Articulos/fuerzas_basicas/portada.jpg',
            imageStyle: 'object-fit: cover; object-position: center;',
            content: `
                <p>En <strong>Alebrijes de Oaxaca Teotihuacán</strong>, entendemos que el futuro se construye desde abajo. Nuestro programa de <strong>Fuerzas Básicas</strong> no solo busca crear futbolistas elite, sino formar seres humanos íntegros, disciplinados y con valores sólidos.</p>

                <h3>Estructura Formativa</h3>
                <p>Nuestra cantera se divide en categorías estratégicas diseñadas para cada etapa del desarrollo biológico y deportivo del joven atleta:</p>

                <h4>Categoría Sub-14</h4>
                <p>El inicio del camino hacia el alto rendimiento. En esta etapa, el enfoque principal es la tecnificación individual y la comprensión de los fundamentos tácticos básicos, sin perder la alegría por el juego.</p>
                <img src="../assets/Articulos/fuerzas_basicas/portada.jpg" alt="Entrenamiento Sub-14" style="width: 100%; border-radius: 8px; margin: 20px 0;">

                <h4>Categoría Sub-16</h4>
                <p>La etapa de consolidación. Aquí la intensidad aumenta; se introducen conceptos tácticos complejos y se fortalece la preparación física específica. La competencia interna comienza a ser un factor clave de desarrollo.</p>

                <h4>Categoría Sub-18 / Piloto</h4>
                <p>La antesala del profesionalismo. Nuestros jóvenes de esta categoría entrenan con la misma intensidad y metodología que el primer equipo de Liga TDP. El objetivo es claro: preparar su debut y consolidación en el fútbol profesional.</p>
            `
        },
        'como-integrarse-al-club': {
            title: 'Como integrarse al club',
            date: '2025-01-13T10:00:00',
            image: '../assets/Nosotros/img-fuerzas-basicas-equipo.jpg',
            content: `
                <p>En <strong>Alebrijes de Oaxaca Teotihuacán</strong>, la única manera oficial de integrarse al club es a través de nuestras <strong>visorías</strong>. Este es el proceso establecido y reconocido por nuestra institución para identificar, evaluar y seleccionar nuevos talentos que formarán parte de nuestro proyecto deportivo.</p>
                
                <h3>¿Por qué solo a través de visorías?</h3>
                
                <p>Las visorías son el mecanismo fundamental que garantiza la equidad, transparencia y profesionalismo en nuestro proceso de captación. Este sistema nos permite:</p>
                
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Evaluación objetiva:</strong> Todos los aspirantes son evaluados bajo los mismos criterios técnicos, tácticos, físicos y psicológicos, asegurando que la selección se base únicamente en el mérito y el potencial deportivo.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Oportunidad igualitaria:</strong> Cualquier joven futbolista, sin importar su procedencia o situación socioeconómica, tiene la misma oportunidad de demostrar su talento y ser seleccionado.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Identificación de talento:</strong> Nuestro cuerpo técnico especializado, con años de experiencia en detección de talento, identifica a aquellos jugadores con el potencial necesario para desarrollarse en nuestro sistema formativo.
                    </li>
                    <li style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid var(--primary); border-radius: 4px;">
                        <strong>Integridad del proceso:</strong> Al mantener un único canal oficial de ingreso, preservamos la integridad y seriedad de nuestro programa de desarrollo, asegurando que cada jugador que ingresa cumple con los estándares requeridos.
                    </li>
                </ul>
                
                <h3>El camino hacia Alebrijes</h3>
                
                <p>Si tu sueño es formar parte de <strong>Alebrijes de Oaxaca Teotihuacán</strong>, el primer paso es participar en una de nuestras visorías oficiales. Este es el único medio reconocido para ingresar a nuestras Fuerzas Básicas, Casa Club y, eventualmente, competir en la Liga TDP con proyección hacia la Liga de Expansión MX.</p>
                
                <p>Nuestras visorías se realizan periódicamente en diferentes sedes a lo largo del país, y toda la información sobre fechas, requisitos y proceso de registro está disponible en nuestro portal oficial de visorías.</p>
                
                <div style="background-color: #f5f5f5; border-radius: 8px; padding: 25px; margin-top: 30px; text-align: center;">
                    <h3 style="margin-top: 0;">¿Listo para comenzar tu camino?</h3>
                    <p>Regístrate en nuestra próxima visoría y demuestra tu talento.</p>
                    <a href="../webvisorias/FormularioDeRegistroVisoria-main/index.html" target="_blank" style="display: inline-block; background-color: var(--primary); color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; transition: background 0.3s;">REGÍSTRATE AQUÍ</a>
                </div>
            `
        }
    };

    // Load article content
    const article = articleDatabase[articleSlug];
    const contentContainer = document.getElementById('article-detail-content');

    if (!article) {
        contentContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2>Artículo no encontrado</h2>
                <p>El artículo que buscas no existe o ha sido eliminado.</p>
                <a href="articulos.html" class="article-detail-back" style="margin-top: 20px;">
                    Volver a Artículos
                </a>
            </div>
        `;
        return;
    }

    // Calculate relative time using the utility function
    const relativeTime = getRelativeTime(article.date);

    // Render article content
    // Render article content
    const imageStyle = article.imageStyle || 'object-fit: cover;'; // Default to cover if not specified

    contentContainer.innerHTML = `
        <div class="article-detail-header">
            <div class="article-detail-meta">
                <span class="article-detail-category">Artículo</span>
                <span>|</span>
                <span>${relativeTime}</span>
            </div>
            <h1 class="article-detail-title">${article.title.toUpperCase()}</h1>
        </div>
        <img src="${article.image}" alt="${article.title}" class="article-detail-image" style="${imageStyle}" onerror="this.src='../assets/Alebrijes Teotihuacan.png';">
        <div class="article-detail-content">
            ${article.content}
        </div>
    `;

    // Update page title
    document.title = `${article.title} | Alebrijes de Oaxaca Teotihuacán`;
});

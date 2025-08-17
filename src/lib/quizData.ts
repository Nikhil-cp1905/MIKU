import type { Question } from "./types";

export const quizQuestions: Question[] = [
  {
    question: "What does GPIO stand for in the context of microcontrollers?",
    options: [
      "General Purpose Input/Output",
      "Global Position Input/Output",
      "General Power Input/Output",
      "Graphical Program Interface/Output",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which of the following is a common communication protocol in embedded systems?",
    options: ["HTTP", "I2C", "TCP/IP", "FTP"],
    correctAnswer: 1,
  },
  {
    question: "What is a watchdog timer used for?",
    options: [
      "To keep track of time",
      "To save power",
      "To recover from software freezes",
      "To control motor speed",
    ],
    correctAnswer: 2,
  },
  {
    question: "Which memory type is non-volatile and often used to store firmware?",
    options: ["SRAM", "DRAM", "Cache", "Flash Memory"],
    correctAnswer: 3,
  },
  {
    question: "An Analog-to-Digital Converter (ADC) does what?",
    options: [
      "Converts digital signals to analog",
      "Converts analog signals to digital",
      "Amplifies analog signals",
      "Filters digital signals",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is 'bare-metal' programming in embedded systems?",
    options: [
      "Programming with a metal-themed IDE",
      "Programming without an operating system",
      "Using a specific C++ library",
      "A type of hardware description language",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which of these is a real-time operating system (RTOS)?",
    options: ["Windows 10", "Linux Ubuntu", "FreeRTOS", "Android"],
    correctAnswer: 2,
  },
  {
    question: "What is PWM used for?",
    options: [
      "Reading sensor data",
      "Transmitting data wirelessly",
      "Debugging code",
      "Controlling the power delivered to electrical devices",
    ],
    correctAnswer: 3,
  },
  {
    question: "The 'endianness' of a processor refers to:",
    options: [
      "The number of cores",
      "The byte order of data in memory",
      "The clock speed",
      "The instruction set architecture",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which language is most commonly used for firmware development?",
    options: ["Python", "Java", "C", "Swift"],
    correctAnswer: 2,
  },
  {
    question: "What is the primary function of a bootloader?",
    options: [
      "To load the main application code",
      "To manage memory",
      "To handle interrupts",
      "To run diagnostics",
    ],
    correctAnswer: 0,
  },
  {
    question: "An interrupt service routine (ISR) should ideally be:",
    options: [
      "Long and complex",
      "Short and fast",
      "Able to call other long functions",
      "Used for all program logic",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does 'cross-compilation' mean?",
    options: [
      "Compiling code on one platform to run on another",
      "Compiling code from multiple source files",
      "A compilation that results in errors",
      "Compiling multiple languages together",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which of these is NOT a typical constraint for embedded systems?",
    options: ["Low power", "Limited memory", "Unlimited processing power", "Real-time response"],
    correctAnswer: 2,
  },
  {
    question: "SPI is a synchronous serial communication protocol. What does 'synchronous' mean?",
    options: [
      "It uses a shared clock signal",
      "It can only send data",
      "It's slower than asynchronous protocols",
      "It doesn't require a ground connection",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is a 'bit-banging'?",
    options: [
      "A hardware-level attack",
      "A method of debugging",
      "Manually implementing a serial protocol using GPIOs",
      "A type of memory corruption",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the purpose of a pull-up resistor on a GPIO pin?",
    options: [
      "To limit current",
      "To ensure a defined state when the pin is not driven",
      "To increase voltage",
      "To act as a fuse",
    ],
    correctAnswer: 1,
  },
  {
    question: "A 'debounce' circuit or algorithm is used for:",
    options: [
      "Filtering power supply noise",
      "Handling mechanical switch inputs reliably",
      "Improving ADC accuracy",
      "Speeding up memory access",
    ],
    correctAnswer: 1,
  },
  {
    question: "In C, what does the `volatile` keyword tell the compiler?",
    options: [
      "That the variable is stored in ROM",
      "That the variable can be modified unexpectedly",
      "That the variable is constant",
      "That the variable should be optimized heavily",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is JTAG used for?",
    options: [
      "General purpose data transfer",
      "Powering the device",
      "On-chip debugging and programming",
      "Wireless communication",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the function of a Digital-to-Analog Converter (DAC)?",
    options: [
      "To convert analog sensor readings to numbers",
      "To produce a variable analog voltage from a digital value",
      "To communicate between two microcontrollers",
      "To store configuration data",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which of the following is a characteristic of a hard real-time system?",
    options: [
      "Missing a deadline is acceptable occasionally",
      "Missing a deadline causes total system failure",
      "Tasks are executed in a random order",
      "It has a graphical user interface",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is a 'stack overflow' in an embedded context?",
    options: [
      "A popular website for developers",
      "When the call stack exceeds its allocated memory space",
      "A type of memory leak",
      "An error in the bootloader",
    ],
    correctAnswer: 1,
  },
  {
    question: "The architecture that has separate memory for instructions and data is called:",
    options: ["Von Neumann architecture", "Princeton architecture", "Harvard architecture", "ARM architecture"],
    correctAnswer: 2,
  },
  {
    question: "What is the primary role of a scheduler in an RTOS?",
    options: [
      "To manage file systems",
      "To update the display",
      "To decide which task to run next",
      "To handle network packets",
    ],
    correctAnswer: 2,
  },
  {
    question: "A 'Mutex' is a synchronization primitive used to:",
    options: [
      "Signal an event",
      "Protect shared resources from concurrent access",
      "Pause a task for a specific duration",
      "Exchange data between tasks",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does UART stand for?",
    options: [
      "Universal Asynchronous Receiver/Transmitter",
      "Uniform Access and Resource Transfer",
      "Universal Addressable Remote Transponder",
      "Unified Asynchronous Real-time Tracker",
    ],
    correctAnswer: 0,
  },
  {
    question: "The 'C' in I2C stands for:",
    options: ["Circuit", "Communication", "Computer", "Chip"],
    correctAnswer: 0,
  },
  {
    question: "Which of the following describes 'firmware'?",
    options: [
      "The physical casing of an electronic device",
      "Software permanently programmed into a read-only memory",
      "A type of hardware component",
      "A subscription service for embedded devices",
    ],
    correctAnswer: 1,
  },
  {
    question: "In embedded C, a `#pragma` directive is used to:",
    options: [
      "Define a macro",
      "Include a header file",
      "Specify implementation-defined compiler instructions",
      "Declare a global variable",
    ],
    correctAnswer: 2,
  },
];

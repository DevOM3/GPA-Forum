export const pageAnimationVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 1.1,
    },
  },
  exit: {
    x: "-100vw",
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

export const pageFooterAnimationVariant = {
  hidden: {
    opacity: 0,
    y: "100vh",
  },
  visible: {
    y: "0vh",
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 1.1,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

export const pageNavbarAnimationVariant = {
  hidden: {
    opacity: 0,
    y: "-100px",
  },
  visible: {
    y: "0vh",
    opacity: 1,
    transition: {
      duration: 0.7,
    },
  },
  exit: {
    y: "-100px",
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

// input animations
export const inputAnimationVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    y: "0vh",
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

// home animations
export const homeTopAnimationVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};
export const homeButtonAnimationVariant = {
  hidden: {
    opacity: 0,
    scale: 2,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};
export const counterDivAnimationVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      delay: 1.1,
      duration: 0.7,
    },
  },
};
export const counterTopAnimationVariant = {
  hidden: {
    opacity: 0,
    y: "-11px",
  },
  visible: {
    y: "0px",
    opacity: 1,
    transition: {
      ease: "easeInOut",
      delay: 1.5,
      duration: 0.7,
    },
  },
};
export const counterBottomAnimationVariant = {
  hidden: {
    opacity: 0,
    y: "11px",
  },
  visible: {
    y: "0px",
    opacity: 1,
    transition: {
      ease: "easeInOut",
      delay: 1,
      duration: 0.7,
    },
  },
};

// mobile navbar animations
export const mobileNavbarAnimationVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

// fade animations
export const fadeAnimationVariant = {
  hidden: {
    opacity: 0,
    y: 11,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 11,
    transition: {
      ease: "easeInOut",
      duration: 0.7,
    },
  },
};
// mid-expand animations
export const fadeWidthAnimationVariant = {
  hidden: {
    opacity: 0,
    y: 11,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 11,
    transition: {
      ease: "easeInOut",
      duration: 0.7,
    },
  },
};

// fab animations
export const fabAnimationVariant = {
  hidden: {
    opacity: 0,
    top: "100vh",
  },
  visible: {
    opacity: 1,
    top: "calc(100vh - 100px)",
  },
  exit: {
    opacity: 0,
    top: "100vh",
    transition: {
      ease: "easeInOut",
      duration: 0.7,
    },
  },
};

export const sizeAnimationVariant = {
  hidden: {
    opacity: 0,
    scaleX: 0,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
  },
  exit: {
    opacity: 0,
    scaleX: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.7,
    },
  },
};

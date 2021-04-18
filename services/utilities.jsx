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
    y: "-100vh",
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
    y: "-100vh",
    opacity: 0,
    transition: {
      ease: "easeInOut",
      delay: 0,
      duration: 0.7,
    },
  },
};

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

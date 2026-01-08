/**
 * Aqua Animation Variants
 *
 * Centralized animation definitions for Mac OS X Tiger UI.
 * All animations use only GPU-accelerated properties (transform, opacity)
 * to ensure consistent 60fps performance.
 */

import type { Variants } from 'motion/react';

// ============================================
// WINDOW ANIMATIONS
// Supports the window lifecycle state machine:
// closed → opening → open → minimizing → minimized → restoring → open
// ============================================

export const windowVariants: Variants = {
  /**
   * Initial/closed state - invisible and slightly scaled down
   */
  closed: {
    opacity: 0,
    scale: 0.8,
  },

  /**
   * Opening animation - fade in and scale up
   * Duration: 200ms for snappy feel
   */
  opening: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },

  /**
   * Open/resting state - fully visible at normal scale
   */
  open: {
    opacity: 1,
    scale: 1,
  },

  /**
   * Closing animation - fade out and scale down
   * Duration: 200ms for snappy feel
   */
  closing: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },

  /**
   * Minimizing animation - fade out, scale down, move toward dock
   * Duration: 300ms for smooth minimize feel
   */
  minimizing: {
    opacity: 0,
    scale: 0.5,
    y: 100,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },

  /**
   * Minimized state - fully hidden
   */
  minimized: {
    opacity: 0,
    scale: 0,
  },

  /**
   * Restoring animation - fade in, scale up, return from dock position
   * Duration: 300ms to match minimize timing
   */
  restoring: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// ============================================
// ICON ANIMATIONS
// Desktop icon interaction states
// ============================================

export const iconVariants: Variants = {
  /**
   * Default/idle state
   */
  idle: {
    scale: 1,
  },

  /**
   * Hover state - no scale change (Tiger didn't zoom icons on hover)
   */
  hover: {
    scale: 1,
  },

  /**
   * Active/pressed state - scale down for click feedback
   */
  active: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// ============================================
// MENU ANIMATIONS
// Dropdown menu show/hide
// ============================================

export const menuVariants: Variants = {
  /**
   * Closed state - invisible and shifted up
   */
  closed: {
    opacity: 0,
    y: -10,
  },

  /**
   * Open state - visible and in position
   */
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};

// ============================================
// FADE ANIMATIONS
// Simple opacity transitions for general use
// ============================================

export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// TYPE EXPORTS
// For type-safe variant state references
// ============================================

export type WindowAnimationState = keyof typeof windowVariants;
export type IconAnimationState = keyof typeof iconVariants;
export type MenuAnimationState = keyof typeof menuVariants;
export type FadeAnimationState = keyof typeof fadeVariants;

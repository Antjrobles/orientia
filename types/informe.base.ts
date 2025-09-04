/**
 * Tipos base y utilidades compartidas para el dominio de Informes.
 * No depende de librerías externas.
 */

// Utilidades
export type UUID = string;
export type ISODateString = string; // 'YYYY-MM-DD'
export type ISODateTimeString = string; // ISO-8601

// Enums (mantener sincronizado con la BD)
export type EstadoInforme = 'borrador' | 'en_progreso' | 'completado' | 'archivado';
export type RolUsuario = 'usuario' | 'admin';
export type PlanUsuario = 'gratis' | 'premium' | 'enterprise';


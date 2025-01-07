export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      parking_history: {
        Row: {
          created_at: string
          endDate: string
          id: string
          parkingId: string
          spotType: string
          startDate: string
          userId: string
          vehicleId: string
        }
        Insert: {
          created_at?: string
          endDate: string
          id?: string
          parkingId: string
          spotType: string
          startDate: string
          userId: string
          vehicleId: string
        }
        Update: {
          created_at?: string
          endDate?: string
          id?: string
          parkingId?: string
          spotType?: string
          startDate?: string
          userId?: string
          vehicleId?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_history_parking_id_fkey"
            columns: ["parkingId"]
            isOneToOne: false
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_history_user_id_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_history_vehicle_id_fkey"
            columns: ["vehicleId"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_proposals: {
        Row: {
          address: string
          biggerSpots: number
          closeHour: string
          created_at: string
          disabledSpots: number
          id: string
          imageUrl: string
          name: string
          openHour: string
          openHours: string
          position: Json
          price: number
          regularSpots: number
          tags: Json
          unitOfTime: string
          usefullInfo: Json
        }
        Insert: {
          address: string
          biggerSpots?: number
          closeHour?: string
          created_at?: string
          disabledSpots?: number
          id?: string
          imageUrl: string
          name: string
          openHour?: string
          openHours: string
          position: Json
          price: number
          regularSpots?: number
          tags: Json
          unitOfTime: string
          usefullInfo: Json
        }
        Update: {
          address?: string
          biggerSpots?: number
          closeHour?: string
          created_at?: string
          disabledSpots?: number
          id?: string
          imageUrl?: string
          name?: string
          openHour?: string
          openHours?: string
          position?: Json
          price?: number
          regularSpots?: number
          tags?: Json
          unitOfTime?: string
          usefullInfo?: Json
        }
        Relationships: []
      }
      parking_ratings: {
        Row: {
          created_at: string
          historyId: string
          id: string
          rating: number
        }
        Insert: {
          created_at?: string
          historyId: string
          id?: string
          rating: number
        }
        Update: {
          created_at?: string
          historyId?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "parking_ratings_history_id_fkey"
            columns: ["historyId"]
            isOneToOne: false
            referencedRelation: "parking_history"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_reservations: {
        Row: {
          created_at: string
          endDate: string
          id: string
          parkingId: string
          spotType: string
          startDate: string
          userId: string
          vehicleId: string
        }
        Insert: {
          created_at?: string
          endDate: string
          id?: string
          parkingId: string
          spotType?: string
          startDate: string
          userId: string
          vehicleId: string
        }
        Update: {
          created_at?: string
          endDate?: string
          id?: string
          parkingId?: string
          spotType?: string
          startDate?: string
          userId?: string
          vehicleId?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_reservations_parking_id_fkey"
            columns: ["parkingId"]
            isOneToOne: false
            referencedRelation: "parkings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_reservations_user_id_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_reservations_vehicle_id_fkey"
            columns: ["vehicleId"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parkings: {
        Row: {
          address: string
          biggerSpots: number
          closeHour: string
          created_at: string
          disabledSpots: number
          id: string
          imageUrl: string
          name: string
          openHour: string
          openHours: string
          position: Json
          price: number
          regularSpots: number
          tags: Json
          unitOfTime: string
          usefullInfo: Json
        }
        Insert: {
          address: string
          biggerSpots?: number
          closeHour?: string
          created_at?: string
          disabledSpots?: number
          id?: string
          imageUrl: string
          name: string
          openHour?: string
          openHours: string
          position: Json
          price: number
          regularSpots?: number
          tags: Json
          unitOfTime: string
          usefullInfo: Json
        }
        Update: {
          address?: string
          biggerSpots?: number
          closeHour?: string
          created_at?: string
          disabledSpots?: number
          id?: string
          imageUrl?: string
          name?: string
          openHour?: string
          openHours?: string
          position?: Json
          price?: number
          regularSpots?: number
          tags?: Json
          unitOfTime?: string
          usefullInfo?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          isAdmin: boolean
          login: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          isAdmin?: boolean
          login: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          isAdmin?: boolean
          login?: string
          name?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          isResolved: boolean
          title: string | null
          type: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          isResolved?: boolean
          title?: string | null
          type?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          isResolved?: boolean
          title?: string | null
          type?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          fuel: string
          id: string
          isPrimary: boolean
          registerNumber: string
          type: string
          userId: string
        }
        Insert: {
          created_at?: string
          fuel: string
          id?: string
          isPrimary?: boolean
          registerNumber: string
          type: string
          userId: string
        }
        Update: {
          created_at?: string
          fuel?: string
          id?: string
          isPrimary?: boolean
          registerNumber?: string
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_available_parkings: {
        Args: {
          _lat: number
          _lng: number
          _start: string
          _end: string
          _spot_type: string
          _unit_of_time: string
          _max_distance: number
        }
        Returns: {
          id: string
          created_at: string
          name: string
          address: string
          openHours: string
          unitOfTime: string
          price: number
          position: Json
          usefullInfo: Json
          imageUrl: string
          tags: Json
          regularSpots: number
          biggerSpots: number
          disabledSpots: number
          distance_km: number
        }[]
      }
      get_parking_rating_info: {
        Args: {
          _parkingid: string
        }
        Returns: {
          ratingcount: number
          ratingaverage: number
        }[]
      }
      get_profiles_with_email: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          created_at: string
          isadmin: boolean
          login: string
          name: string
          email: string
        }[]
      }
      get_tickets_with_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          userId: string
          title: string
          description: string
          type: string
          isResolved: boolean
          created_at: string
          user_info: Json
        }[]
      }
      get_user_parking_history_with_vehicle_and_parking: {
        Args: {
          _userid: string
        }
        Returns: {
          id: string
          created_at: string
          startDate: string
          endDate: string
          spotType: string
          vehicle: Json
          parking: Json
        }[]
      }
      get_user_reservations_with_vehicle_and_parking: {
        Args: {
          _userid: string
        }
        Returns: {
          id: string
          created_at: string
          startDate: string
          endDate: string
          spotType: string
          vehicle: Json
          parking: Json
        }[]
      }
      move_ended_reservations_to_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_primary_vehicle: {
        Args: {
          _userid: string
          _vehicleid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

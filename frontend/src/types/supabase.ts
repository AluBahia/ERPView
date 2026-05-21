export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bens_patrimoniais: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string | null
          depreciacao_acumulada: number | null
          descricao: string
          id: number
          localizacao: string | null
          status: string | null
          updated_at: string | null
          valor_liquido: number | null
          valor_original: number | null
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string | null
          depreciacao_acumulada?: number | null
          descricao: string
          id?: number
          localizacao?: string | null
          status?: string | null
          updated_at?: string | null
          valor_liquido?: number | null
          valor_original?: number | null
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          depreciacao_acumulada?: number | null
          descricao?: string
          id?: number
          localizacao?: string | null
          status?: string | null
          updated_at?: string | null
          valor_liquido?: number | null
          valor_original?: number | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          classe_abc: string | null
          codigo: string
          created_at: string | null
          frequencia: string | null
          id: number
          nome: string
          prazo_medio: string | null
          segmento: string | null
          status_credito: string | null
          updated_at: string | null
          volume_compras: number | null
        }
        Insert: {
          classe_abc?: string | null
          codigo: string
          created_at?: string | null
          frequencia?: string | null
          id?: number
          nome: string
          prazo_medio?: string | null
          segmento?: string | null
          status_credito?: string | null
          updated_at?: string | null
          volume_compras?: number | null
        }
        Update: {
          classe_abc?: string | null
          codigo?: string
          created_at?: string | null
          frequencia?: string | null
          id?: number
          nome?: string
          prazo_medio?: string | null
          segmento?: string | null
          status_credito?: string | null
          updated_at?: string | null
          volume_compras?: number | null
        }
        Relationships: []
      }
      custos: {
        Row: {
          created_at: string | null
          custo_indireto: number | null
          custo_materia_prima: number | null
          custo_mao_obra: number | null
          custo_total: number | null
          id: number
          periodo: string
          produto_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custo_indireto?: number | null
          custo_materia_prima?: number | null
          custo_mao_obra?: number | null
          custo_total?: number | null
          id?: number
          periodo: string
          produto_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custo_indireto?: number | null
          custo_materia_prima?: number | null
          custo_mao_obra?: number | null
          custo_total?: number | null
          id?: number
          periodo?: string
          produto_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          }
        ]
      }
      dashboard_kpis: {
        Row: {
          contas_pagar_vencer: number | null
          contas_receber_vencidas: number | null
          created_at: string | null
          data: string | null
          giro_estoque: number | null
          id: number
          ncr_abertas: number | null
          os_manutencao_pendentes: number | null
          producao_dia: number | null
          updated_at: string | null
          vendas_dia: number | null
          vendas_mes: number | null
        }
        Insert: {
          contas_pagar_vencer?: number | null
          contas_receber_vencidas?: number | null
          created_at?: string | null
          data?: string | null
          giro_estoque?: number | null
          id?: number
          ncr_abertas?: number | null
          os_manutencao_pendentes?: number | null
          producao_dia?: number | null
          updated_at?: string | null
          vendas_dia?: number | null
          vendas_mes?: number | null
        }
        Update: {
          contas_pagar_vencer?: number | null
          contas_receber_vencidas?: number | null
          created_at?: string | null
          data?: string | null
          giro_estoque?: number | null
          id?: number
          ncr_abertas?: number | null
          os_manutencao_pendentes?: number | null
          producao_dia?: number | null
          updated_at?: string | null
          vendas_dia?: number | null
          vendas_mes?: number | null
        }
        Relationships: []
      }
      dre: {
        Row: {
          created_at: string | null
          custo_produtos: number | null
          deducoes: number | null
          id: number
          lucro_bruto: number | null
          periodo: string
          receita_bruta: number | null
          receita_liquida: number | null
          resultado_liquido: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custo_produtos?: number | null
          deducoes?: number | null
          id?: number
          lucro_bruto?: number | null
          periodo: string
          receita_bruta?: number | null
          receita_liquida?: number | null
          resultado_liquido?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custo_produtos?: number | null
          deducoes?: number | null
          id?: number
          lucro_bruto?: number | null
          periodo?: string
          receita_bruta?: number | null
          receita_liquida?: number | null
          resultado_liquido?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fluxo_caixa: {
        Row: {
          categoria: string
          created_at: string | null
          data: string
          descricao: string | null
          id: number
          saldo_acumulado: number | null
          tipo: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          data: string
          descricao?: string | null
          id?: number
          saldo_acumulado?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          id?: number
          saldo_acumulado?: number | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          avaliacao: number | null
          categoria: string | null
          created_at: string | null
          documentacao: string | null
          homologacao: string | null
          id: number
          nome: string
          updated_at: string | null
        }
        Insert: {
          avaliacao?: number | null
          categoria?: string | null
          created_at?: string | null
          documentacao?: string | null
          homologacao?: string | null
          id?: number
          nome: string
          updated_at?: string | null
        }
        Update: {
          avaliacao?: number | null
          categoria?: string | null
          created_at?: string | null
          documentacao?: string | null
          homologacao?: string | null
          id?: number
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      itens_estoque: {
        Row: {
          codigo: string
          cobertura: string | null
          created_at: string | null
          descricao: string
          deposito: string | null
          id: number
          minimo: number | null
          saldo: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          codigo: string
          cobertura?: string | null
          created_at?: string | null
          descricao: string
          deposito?: string | null
          id?: number
          minimo?: number | null
          saldo?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          cobertura?: string | null
          created_at?: string | null
          descricao?: string
          deposito?: string | null
          id?: number
          minimo?: number | null
          saldo?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      log_auditoria: {
        Row: {
          acao: string
          dados: Json | null
          id: number
          registro_id: string | null
          tabela: string
          timestamp: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          dados?: Json | null
          id?: number
          registro_id?: string | null
          tabela: string
          timestamp?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          dados?: Json | null
          id?: number
          registro_id?: string | null
          tabela?: string
          timestamp?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ncr: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: number
          numero: string
          prazo: string | null
          produto: string | null
          responsavel: string | null
          status: string | null
          updated_at: string | null
          vencida: boolean | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          numero: string
          prazo?: string | null
          produto?: string | null
          responsavel?: string | null
          status?: string | null
          updated_at?: string | null
          vencida?: boolean | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: number
          numero?: string
          prazo?: string | null
          produto?: string | null
          responsavel?: string | null
          status?: string | null
          updated_at?: string | null
          vencida?: boolean | null
        }
        Relationships: []
      }
      notas_fiscais: {
        Row: {
          contraparte: string
          created_at: string | null
          data_emissao: string | null
          id: number
          numero: string
          status: string | null
          tipo: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          contraparte: string
          created_at?: string | null
          data_emissao?: string | null
          id?: number
          numero: string
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          contraparte?: string
          created_at?: string | null
          data_emissao?: string | null
          id?: number
          numero?: string
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      ordens_producao: {
        Row: {
          created_at: string | null
          desvio: string | null
          fim_prev: string | null
          id: number
          inicio_prev: string | null
          produto: string
          quantidade: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          desvio?: string | null
          fim_prev?: string | null
          id?: number
          inicio_prev?: string | null
          produto: string
          quantidade?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          desvio?: string | null
          fim_prev?: string | null
          id?: number
          inicio_prev?: string | null
          produto?: string
          quantidade?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          abertura: string | null
          created_at: string | null
          equipamento: string
          id: number
          prev_conclusao: string | null
          prioridade: string | null
          status: string | null
          updated_at: string | null
          tipo: string | null
        }
        Insert: {
          abertura?: string | null
          created_at?: string | null
          equipamento: string
          id?: number
          prev_conclusao?: string | null
          prioridade?: string | null
          status?: string | null
          updated_at?: string | null
          tipo?: string | null
        }
        Update: {
          abertura?: string | null
          created_at?: string | null
          equipamento?: string
          id?: number
          prev_conclusao?: string | null
          prioridade?: string | null
          status?: string | null
          updated_at?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      pedidos_expedicao: {
        Row: {
          cidade: string | null
          cliente: string
          created_at: string | null
          id: number
          numero: string
          peso: number | null
          prev_entrega: string | null
          status: string | null
          transportadora: string | null
          updated_at: string | null
        }
        Insert: {
          cidade?: string | null
          cliente: string
          created_at?: string | null
          id?: number
          numero: string
          peso?: number | null
          prev_entrega?: string | null
          status?: string | null
          transportadora?: string | null
          updated_at?: string | null
        }
        Update: {
          cidade?: string | null
          cliente?: string
          created_at?: string | null
          id?: number
          numero?: string
          peso?: number | null
          prev_entrega?: string | null
          status?: string | null
          transportadora?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pedidos_venda: {
        Row: {
          cliente_id: number | null
          created_at: string | null
          data_pedido: string | null
          id: number
          numero: string
          status: string | null
          updated_at: string | null
          valor_total: number | null
          vendedor: string | null
        }
        Insert: {
          cliente_id?: number | null
          created_at?: string | null
          data_pedido?: string | null
          id?: number
          numero: string
          status?: string | null
          updated_at?: string | null
          valor_total?: number | null
          vendedor?: string | null
        }
        Update: {
          cliente_id?: number | null
          created_at?: string | null
          data_pedido?: string | null
          id?: number
          numero?: string
          status?: string | null
          updated_at?: string | null
          valor_total?: number | null
          vendedor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_venda_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      perfis_usuario: {
        Row: {
          cargo: string | null
          created_at: string | null
          id: number
          modulos_permitidos: string[] | null
          nome: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          id?: number
          modulos_permitidos?: string[] | null
          nome: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          id?: number
          modulos_permitidos?: string[] | null
          nome?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_usuario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      produtos: {
        Row: {
          codigo: string
          created_at: string | null
          custo: number | null
          descricao: string
          giro: string | null
          id: number
          margem: number | null
          preco_venda: number | null
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          custo?: number | null
          descricao: string
          giro?: string | null
          id?: number
          margem?: number | null
          preco_venda?: number | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          custo?: number | null
          descricao?: string
          giro?: string | null
          id?: number
          margem?: number | null
          preco_venda?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rh_colaboradores: {
        Row: {
          cargo: string
          created_at: string | null
          data_admissao: string
          departamento: string
          id: number
          matricula: string
          nome: string
          salario: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cargo: string
          created_at?: string | null
          data_admissao: string
          departamento: string
          id?: number
          matricula: string
          nome: string
          salario?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string
          created_at?: string | null
          data_admissao?: string
          departamento?: string
          id?: number
          matricula?: string
          nome?: string
          salario?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      titulos_pagar: {
        Row: {
          categoria: string | null
          created_at: string | null
          emissao: string | null
          fornecedor: string
          id: number
          numero: string
          status: string | null
          updated_at: string | null
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          emissao?: string | null
          fornecedor: string
          id?: number
          numero: string
          status?: string | null
          updated_at?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          emissao?: string | null
          fornecedor?: string
          id?: number
          numero?: string
          status?: string | null
          updated_at?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: []
      }
      titulos_receber: {
        Row: {
          cliente_id: number | null
          created_at: string | null
          dias_atraso: number | null
          emissao: string | null
          id: number
          numero: string
          status: string | null
          updated_at: string | null
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          cliente_id?: number | null
          created_at?: string | null
          dias_atraso?: number | null
          emissao?: string | null
          id?: number
          numero: string
          status?: string | null
          updated_at?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          cliente_id?: number | null
          created_at?: string | null
          dias_atraso?: number | null
          emissao?: string | null
          id?: number
          numero?: string
          status?: string | null
          updated_at?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "titulos_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

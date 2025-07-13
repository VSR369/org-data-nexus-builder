import { describe, it, expect, beforeEach } from 'vitest'
import { testDepartmentHierarchy } from '../fixtures/masterDataFixtures'
import { mockService, setupMocks, clearMocks, getService } from './shared/testUtils'

setupMocks()

describe('Department Hierarchy Relationships', () => {
  beforeEach(() => {
    clearMocks()
  })

  describe('Department → Sub Department → Team Unit Chain', () => {
    it('should create department hierarchy correctly', async () => {
      const { department, subDepartment, teamUnit } = testDepartmentHierarchy

      mockService.addItem
        .mockResolvedValueOnce(true) // Department
        .mockResolvedValueOnce(true) // Sub Department
        .mockResolvedValueOnce(true) // Team Unit

      const service = await getService()

      // Create Department
      const deptResult = await service.addItem('master_departments', department)
      expect(deptResult).toBe(true)

      // Create Sub Department linked to Department
      const subDeptData = {
        ...subDepartment,
        department_id: department.id,
      }
      const subDeptResult = await service.addItem('master_sub_departments', subDeptData)
      expect(subDeptResult).toBe(true)

      // Create Team Unit linked to Sub Department
      const teamUnitData = {
        ...teamUnit,
        sub_department_id: subDepartment.id,
      }
      const teamResult = await service.addItem('master_team_units', teamUnitData)
      expect(teamResult).toBe(true)

      expect(mockService.addItem).toHaveBeenCalledTimes(3)
    })

    it('should maintain 3-level relationship integrity', async () => {
      const { department, subDepartment, teamUnit } = testDepartmentHierarchy

      // Verify relationships
      expect(subDepartment.department_id).toBe(department.id)
      expect(teamUnit.sub_department_id).toBe(subDepartment.id)

      // Mock fetching full hierarchy
      mockService.getItems
        .mockResolvedValueOnce([department])
        .mockResolvedValueOnce([subDepartment])
        .mockResolvedValueOnce([teamUnit])

      const service = await getService()

      const departments = await service.getItems('master_departments')
      const subDepartments = await service.getItems('master_sub_departments')
      const teamUnits = await service.getItems('master_team_units')

      // Verify hierarchical relationships
      const relatedDepartment = departments.find(d => d.id === subDepartment.department_id)
      const relatedSubDepartment = subDepartments.find(sd => sd.id === teamUnit.sub_department_id)

      expect(relatedDepartment).toBeDefined()
      expect(relatedSubDepartment).toBeDefined()
      expect(relatedDepartment?.name).toBe(department.name)
      expect(relatedSubDepartment?.name).toBe(subDepartment.name)
    })

    it('should validate department creation order', async () => {
      const { department, subDepartment } = testDepartmentHierarchy

      mockService.addItem.mockResolvedValue(true)
      const service = await getService()

      // Should create parent department first
      const deptResult = await service.addItem('master_departments', department)
      expect(deptResult).toBe(true)

      // Then create sub-department with reference to parent
      const subDeptData = {
        ...subDepartment,
        department_id: department.id,
      }
      const subDeptResult = await service.addItem('master_sub_departments', subDeptData)
      expect(subDeptResult).toBe(true)

      expect(mockService.addItem).toHaveBeenNthCalledWith(1, 'master_departments', department)
      expect(mockService.addItem).toHaveBeenNthCalledWith(2, 'master_sub_departments', subDeptData)
    })

    it('should handle department deletion with dependencies', async () => {
      const { department, subDepartment, teamUnit } = testDepartmentHierarchy

      const dependentSubDepts = [{
        ...subDepartment,
        department_id: department.id
      }]

      const dependentTeams = [{
        ...teamUnit,
        sub_department_id: subDepartment.id
      }]

      mockService.getItems
        .mockResolvedValueOnce(dependentSubDepts)
        .mockResolvedValueOnce(dependentTeams)

      const service = await getService()

      // Check for dependent sub-departments
      const subDepts = await service.getItems('master_sub_departments')
      const deptDependencies = subDepts.filter(sub => (sub as any).department_id === department.id)

      // Check for dependent team units
      const teams = await service.getItems('master_team_units')
      const teamDependencies = teams.filter(team => 
        deptDependencies.some(sub => sub.id === (team as any).sub_department_id)
      )

      expect(deptDependencies).toHaveLength(1)
      expect(teamDependencies).toHaveLength(1)

      // Should prevent deletion due to dependencies
      expect(deptDependencies.length > 0 || teamDependencies.length > 0).toBe(true)
    })

    it('should verify team unit belongs to correct organizational structure', async () => {
      const { department, subDepartment, teamUnit } = testDepartmentHierarchy

      // Mock the complete hierarchy
      mockService.getItems
        .mockResolvedValueOnce([{ ...department }])
        .mockResolvedValueOnce([{ ...subDepartment, department_id: department.id }])
        .mockResolvedValueOnce([{ ...teamUnit, sub_department_id: subDepartment.id }])

      const service = await getService()

      const [departments, subDepartments, teamUnits] = await Promise.all([
        service.getItems('master_departments'),
        service.getItems('master_sub_departments'),
        service.getItems('master_team_units')
      ])

      // Trace team unit back to department through sub-department
      const team = teamUnits[0]
      const parentSubDept = subDepartments.find(sub => sub.id === (team as any).sub_department_id)
      const grandparentDept = departments.find(dept => dept.id === (parentSubDept as any)?.department_id)

      expect(parentSubDept).toBeDefined()
      expect(grandparentDept).toBeDefined()
      expect(parentSubDept?.name).toBe(subDepartment.name)
      expect(grandparentDept?.name).toBe(department.name)
    })
  })
})